'use client';

import * as React from 'react';
import type { Event } from '@/lib/history/types';
import {
  buildCommanderNetwork,
  type CommanderNode,
  type CommanderRelation,
} from '@/lib/history/commanderNetwork';
import { useTranslations } from 'next-intl';
import { formatYear } from '@/lib/history/utils';

interface CommanderNetworkGraphProps {
  events: Event[];
  onCommanderClick?: (commanderName: string) => void;
  selectedCommander?: string | null;
}

interface LayoutNode {
  node: CommanderNode;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

interface LayoutEdge {
  relation: CommanderRelation;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Simple circular layout with collision avoidance.
 * Positions nodes in a circle, then adjusts for overlap.
 */
function layoutNodes(
  nodes: CommanderNode[],
  width: number,
  height: number,
  centerX: number,
  centerY: number
): LayoutNode[] {
  const radius = Math.min(width, height) * 0.38;
  const result: LayoutNode[] = [];

  // Place in circle first
  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    result.push({
      node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  // Simple collision resolution (push overlapping nodes apart)
  const minDist = 80;
  for (let iter = 0; iter < 20; iter++) {
    let moved = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && dist > 0) {
          const push = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  return result;
}

function getNodeRadius(node: CommanderNode): number {
  // Base radius 18, scale by battles (max ~36)
  return Math.min(18 + node.battles * 2, 36);
}

function getEdgeStroke(relation: CommanderRelation): string {
  return relation.relationType === 'collaborated'
    ? '#22c55e'
    : '#ef4444';
}

function getEdgeOpacity(relation: CommanderRelation): number {
  return Math.min(0.3 + relation.battleCount * 0.1, 0.9);
}

function getEdgeWidth(relation: CommanderRelation): number {
  return Math.min(1 + relation.battleCount * 0.5, 5);
}

export function CommanderNetworkGraph({
  events,
  onCommanderClick,
  selectedCommander,
}: CommanderNetworkGraphProps) {
  const t = useTranslations();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 600, height: 400 });
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<{
    name: string;
    x: number;
    y: number;
    node: CommanderNode;
  } | null>(null);

  const battles = React.useMemo(
    () => events.filter((e) => e.battle?.commanders),
    [events]
  );

  const network = React.useMemo(
    () => (battles.length >= 2 ? buildCommanderNetwork(battles) : null),
    [battles]
  );

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height: Math.max(height, 300) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Layout nodes
  const layoutNodesResult = React.useMemo(() => {
    if (!network || network.nodes.length === 0) return [];
    return layoutNodes(network.nodes, dimensions.width, dimensions.height, dimensions.width / 2, dimensions.height / 2);
  }, [network, dimensions]);

  // Map node name → position
  const nodePositions = React.useMemo(() => {
    const map = new Map<string, LayoutNode>();
    for (const ln of layoutNodesResult) {
      map.set(ln.node.name, ln);
    }
    return map;
  }, [layoutNodesResult]);

  // Edges with positions
  const layoutEdges = React.useMemo((): LayoutEdge[] => {
    if (!network) return [];
    const edges: LayoutEdge[] = [];
    for (const rel of network.relations) {
      const from = nodePositions.get(rel.commander1);
      const to = nodePositions.get(rel.commander2);
      if (from && to) {
        edges.push({
          relation: rel,
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
        });
      }
    }
    return edges;
  }, [network, nodePositions]);

  if (!network || network.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
        {t('commanders.noData') || '暂无指挥官数据'}
      </div>
    );
  }

  const { width, height } = dimensions;

  return (
    <div className="relative" ref={containerRef}>
      <svg
        width={width}
        height={height}
        className="w-full h-full"
        style={{ minHeight: 300 }}
      >
        {/* Edges (render first, below nodes) */}
        {layoutEdges.map((edge, i) => (
          <line
            key={i}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke={getEdgeStroke(edge.relation)}
            strokeWidth={getEdgeWidth(edge.relation)}
            strokeOpacity={getEdgeOpacity(edge.relation)}
          />
        ))}

        {/* Nodes */}
        {layoutNodesResult.map((ln) => {
          const r = getNodeRadius(ln.node);
          const isHovered = hoveredNode === ln.node.name;
          const isSelected = selectedCommander === ln.node.name;
          const isHighlighted =
            hoveredNode !== null &&
            layoutEdges.some(
              (e) =>
                e.relation.commander1 === hoveredNode ||
                e.relation.commander2 === hoveredNode
            );
          const dimmed = hoveredNode !== null && !isHovered && !isHighlighted;

          return (
            <g
              key={ln.node.name}
              transform={`translate(${ln.x},${ln.y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onCommanderClick?.(ln.node.name)}
              onMouseEnter={() => {
                setHoveredNode(ln.node.name);
                setTooltip({
                  name: ln.node.name,
                  x: ln.x,
                  y: ln.y - r - 8,
                  node: ln.node,
                });
              }}
              onMouseLeave={() => {
                setHoveredNode(null);
                setTooltip(null);
              }}
            >
              {/* Glow for selected */}
              {isSelected && (
                <circle
                  r={r + 6}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeOpacity={0.6}
                />
              )}
              {/* Node circle */}
              <circle
                r={r + (isHovered ? 3 : 0)}
                fill={
                  isSelected
                    ? '#6366f1'
                    : isHovered
                    ? '#3b82f6'
                    : dimmed
                    ? '#d1d5db'
                    : '#60a5fa'
                }
                fillOpacity={dimmed ? 0.4 : 0.85}
                stroke={isSelected ? '#4f46e5' : '#2563eb'}
                strokeWidth={isSelected || isHovered ? 2 : 1}
                strokeOpacity={dimmed ? 0.3 : 0.9}
              />
              {/* Label */}
              <text
                y={r + 14}
                textAnchor="middle"
                fontSize={10}
                fill={dimmed ? '#9ca3af' : '#1e293b'}
                fillOpacity={dimmed ? 0.5 : 0.9}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {ln.node.name.length > 8 ? ln.node.name.slice(0, 7) + '…' : ln.node.name}
              </text>
              {/* Battle count badge */}
              <circle
                cx={r * 0.7}
                cy={-r * 0.7}
                r={8}
                fill="#1e293b"
                fillOpacity={0.8}
              />
              <text
                y={-r * 0.7 + 3}
                textAnchor="middle"
                fontSize={8}
                fill="white"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {ln.node.battles}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 bg-zinc-800 text-zinc-100 rounded-xl px-3 py-2 text-xs shadow-xl border border-zinc-600"
          style={{
            left: Math.min(tooltip.x, width - 180),
            top: Math.max(tooltip.y - 10, 0),
            transform: 'translateY(-100%)',
          }}
        >
          <div className="font-bold text-sm mb-1">👤 {tooltip.name}</div>
          <div className="space-y-0.5">
            <div>
              ⚔️ {tooltip.node.battles} 场战役 · {tooltip.node.winRate}% 胜率
            </div>
            <div>
              🤝 {tooltip.node.collaborators.length} 搭档 · ⚔️ {tooltip.node.opponents.length} 对手
            </div>
            {tooltip.node.firstBattle !== undefined && (
              <div>
                📅{' '}
                {formatYear(tooltip.node.firstBattle)}
                {tooltip.node.lastBattle !== undefined &&
                  tooltip.node.lastBattle !== tooltip.node.firstBattle &&
                  ` – ${formatYear(tooltip.node.lastBattle)}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-zinc-800/80 rounded-lg px-2 py-1.5 text-xs flex gap-3 border border-zinc-200 dark:border-zinc-700">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-green-500 rounded"></span>
          <span className="text-zinc-600 dark:text-zinc-400">合作</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-red-500 rounded"></span>
          <span className="text-zinc-600 dark:text-zinc-400">对决</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
          <span className="text-zinc-600 dark:text-zinc-400">指挥官</span>
        </span>
      </div>
    </div>
  );
}
