# CHGIS 历史政区数据

本目录用于存放 [CHGIS V6](https://dataverse.harvard.edu/dataverse/chgis_v6) 原始 Shapefile 与构建产物。

## 许可说明

CHGIS 数据仅供**学术研究**使用，**禁止商用与再分发**。使用前请阅读数据包内的 `CHGIS_V6_EULA.txt`。

本项目通过本地构建脚本将 Shapefile 转为简化 GeoJSON，供 History Atlas 地图展示。若你 fork 或部署本项目，请自行从官方渠道下载原始数据并本地构建，勿将完整构建产物公开再分发。

## 下载原始数据

1. 打开 [Harvard Dataverse — V6 Time Series Prefecture Polygons](https://doi.org/10.7910/DVN/I0Q7SM)
2. 下载 **`v6_time_pref_pgn_utf_wgs84.zip`**（府级政区时间序列，WGS84 UTF-8）
3. 解压到 `data/chgis/raw/v6_time_pref_pgn_utf_wgs84/`

也可直接下载 zip 放到 `data/chgis/raw/` 下，构建脚本会自动解压。

```powershell
curl.exe -L "https://dataverse.harvard.edu/api/access/datafile/2966510" -o data/chgis/raw/v6_time_pref_pgn_utf_wgs84.zip
```

## 构建 GeoJSON 快照

```powershell
pip install -r scripts/chgis/requirements.txt
npm run chgis:build
```

默认会为各历史时代代表年份生成 `src/lib/history/data/chgis/snapshots/*.json`，并更新 `snapshots/index.ts` 索引。

指定年份：

```powershell
python scripts/chgis/build_boundaries.py --years -221 618 1820
```

## 数据范围

CHGIS 府级时间序列约覆盖 **前 224 年 — 1911 年**。更早的年份（如战国）无 CHGIS 数据，地图不显示历史疆域 overlay，仅保留都城标记与事件点。
