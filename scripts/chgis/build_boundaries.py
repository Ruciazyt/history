#!/usr/bin/env python3
"""Build simplified CHGIS prefecture GeoJSON snapshots for History Atlas."""

from __future__ import annotations

import argparse
import json
import math
import zipfile
from pathlib import Path
from typing import Any

import shapefile

ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "data" / "chgis" / "raw"
SHAPE_DIR = RAW_DIR / "v6_time_pref_pgn_utf_wgs84"
SHAPE_ZIP = RAW_DIR / "v6_time_pref_pgn_utf_wgs84.zip"
SHAPE_BASENAME = "v6_time_pref_pgn_utf_wgs84"
OUT_DIR = ROOT / "src" / "lib" / "history" / "data" / "chgis" / "snapshots"

# Era representative years (BCE negative). Warring States omitted — CHGIS starts ~-224.
DEFAULT_YEARS = [
    -221,
    -206,
    -100,
    25,
    220,
    618,
    907,
    960,
    1279,
    1368,
    1644,
    1820,
    1911,
]

SIMPLIFY_TOLERANCE = 0.008


def year_filename(year: int) -> str:
    if year < 0:
        return f"n{abs(year):04d}.json"
    return f"p{year:04d}.json"


def ensure_shapefile() -> Path:
    shp = SHAPE_DIR / f"{SHAPE_BASENAME}.shp"
    if shp.exists():
        return shp

    if not SHAPE_ZIP.exists():
        raise FileNotFoundError(
            f"Missing CHGIS shapefile. Download v6_time_pref_pgn_utf_wgs84.zip to {SHAPE_ZIP}\n"
            "See data/chgis/README.md"
        )

    SHAPE_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(SHAPE_ZIP) as zf:
        zf.extractall(SHAPE_DIR)

    if not shp.exists():
        raise FileNotFoundError(f"Expected {shp} after extracting {SHAPE_ZIP}")
    return shp


def perpendicular_distance(point: tuple[float, float], start: tuple[float, float], end: tuple[float, float]) -> float:
    x0, y0 = point
    x1, y1 = start
    x2, y2 = end
    dx = x2 - x1
    dy = y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x0 - x1, y0 - y1)
    t = ((x0 - x1) * dx + (y0 - y1) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return math.hypot(x0 - proj_x, y0 - proj_y)


def douglas_peucker(points: list[list[float]], tolerance: float) -> list[list[float]]:
    if len(points) <= 2:
        return points

    start = (points[0][0], points[0][1])
    end = (points[-1][0], points[-1][1])
    max_dist = 0.0
    index = 0
    for i in range(1, len(points) - 1):
        dist = perpendicular_distance((points[i][0], points[i][1]), start, end)
        if dist > max_dist:
            max_dist = dist
            index = i

    if max_dist > tolerance:
        left = douglas_peucker(points[: index + 1], tolerance)
        right = douglas_peucker(points[index:], tolerance)
        return left[:-1] + right
    return [points[0], points[-1]]


def ring_area(ring: list[list[float]]) -> float:
    area = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        area += x1 * y2 - x2 * y1
    return area / 2.0


def orient_ring(ring: list[list[float]], clockwise: bool) -> list[list[float]]:
    is_clockwise = ring_area(ring) < 0
    if is_clockwise == clockwise:
        return ring
    return list(reversed(ring))


def shape_to_geojson(shape: shapefile.Shape, tolerance: float) -> dict[str, Any] | None:
    if shape.shapeType not in (shapefile.POLYGON, shapefile.POLYGONZ, shapefile.POLYGONM):
        return None

    parts = list(shape.parts) + [len(shape.points)]
    rings: list[list[list[float]]] = []

    for i in range(len(shape.parts)):
        part_points = shape.points[parts[i] : parts[i + 1]]
        if len(part_points) < 3:
            continue
        ring = [[round(x, 5), round(y, 5)] for x, y in part_points]
        if ring[0] != ring[-1]:
            ring.append(ring[0])
        ring = douglas_peucker(ring, tolerance)
        if len(ring) >= 4:
            rings.append(ring)

    if not rings:
        return None

    # First ring = outer shell; rest = holes (orient for GeoJSON)
    outer = orient_ring(rings[0], clockwise=False)
    holes = [orient_ring(r, clockwise=True) for r in rings[1:]]

    if holes:
        return {"type": "Polygon", "coordinates": [outer, *holes]}
    return {"type": "Polygon", "coordinates": [outer]}


def active_at_year(rec: shapefile.Record, year: int) -> bool:
    beg = int(rec["BEG_YR"])
    end = int(rec["END_YR"])
    return beg <= year <= end


def build_snapshot(reader: shapefile.Reader, year: int, tolerance: float) -> dict[str, Any]:
    features: list[dict[str, Any]] = []

    for shape_rec in reader.iterShapeRecords():
        rec = shape_rec.record
        if not active_at_year(rec, year):
            continue

        geometry = shape_to_geojson(shape_rec.shape, tolerance)
        if geometry is None:
            continue

        sys_id = int(rec["SYS_ID"])
        features.append(
            {
                "type": "Feature",
                "id": sys_id,
                "properties": {
                    "sysId": sys_id,
                    "nameCh": (rec["NAME_CH"] or "").strip(),
                    "namePy": (rec["NAME_PY"] or "").strip(),
                    "begYr": int(rec["BEG_YR"]),
                    "endYr": int(rec["END_YR"]),
                    "levRank": (rec["LEV_RANK"] or "").strip(),
                },
                "geometry": geometry,
            }
        )

    return {
        "type": "FeatureCollection",
        "properties": {
            "source": "CHGIS V6 Time Series Prefecture Polygons",
            "year": year,
            "featureCount": len(features),
        },
        "features": features,
    }


def write_index(years: list[int]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "years": years,
        "files": {str(y): year_filename(y) for y in years},
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    lines = []
    entries = []
    for y in sorted(years):
        fname = year_filename(y)
        var = f"s_{fname.replace('.json', '')}"
        lines.append(f"import {var} from './{fname}';")
        entries.append(f"  {y}: {var} as ChgisSnapshot," if y >= 0 else f"  [{y}]: {var} as ChgisSnapshot,")

    index_ts = (
        "// Auto-generated by scripts/chgis/build_boundaries.py — do not edit manually\n"
        "import type { ChgisSnapshot } from '@/lib/history/chgis/types';\n\n"
        + "\n".join(lines)
        + "\n\nexport const chgisSnapshots: Record<number, ChgisSnapshot> = {\n"
        + "\n".join(entries)
        + "\n};\n\n"
        + "export const chgisYears = "
        + json.dumps(sorted(years))
        + " as const;\n"
    )
    (OUT_DIR / "index.ts").write_text(index_ts, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build CHGIS GeoJSON snapshots")
    parser.add_argument(
        "--years",
        nargs="*",
        type=int,
        default=DEFAULT_YEARS,
        help="Target years (negative for BCE)",
    )
    parser.add_argument(
        "--tolerance",
        type=float,
        default=SIMPLIFY_TOLERANCE,
        help="Douglas-Peucker tolerance in degrees",
    )
    args = parser.parse_args()

    shp_path = ensure_shapefile()
    reader = shapefile.Reader(str(shp_path).replace(".shp", ""))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    built_years: list[int] = []

    for year in sorted(set(args.years)):
        snapshot = build_snapshot(reader, year, args.tolerance)
        out_file = OUT_DIR / year_filename(year)
        out_file.write_text(json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        count = snapshot["properties"]["featureCount"]
        size_kb = out_file.stat().st_size / 1024
        print(f"  {year}: {count} features -> {out_file.name} ({size_kb:.1f} KB)")
        built_years.append(year)

    write_index(built_years)
    print(f"\nWrote manifest and index for {len(built_years)} years.")


if __name__ == "__main__":
    main()
