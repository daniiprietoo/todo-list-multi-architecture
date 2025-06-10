import ReactFlow, {
  Background,
  Controls,
  type Edge,
  MarkerType,
  type Node,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Helper to color nodes by latency
function getColor(latency: number) {
  if (latency < 10) return "#22c55e"; // green
  if (latency < 50) return "#eab308"; // yellow
  return "#ef4444"; // red
}

export type TraceStep = {
  name: string;
  latency: number;
};

export type TraceDiagramProps = {
  trace: TraceStep[];
  title?: string;
};

// Helper to extract layer and function
function parseStepName(name: string) {
  const [layer, func] = name.split(":").map((s) => s.trim());
  return { layer, func };
}

export const TraceDiagram: React.FC<TraceDiagramProps> = ({ trace, title }) => {
  // Map each step to a node, grouping by layer
  const nodes: Node[] = trace.map((step, idx) => {
    const { layer, func } = parseStepName(step.name);
    return {
      id: String(idx),
      data: {
        label: (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 600 }}>{layer}</div>
            <div style={{ fontSize: 13 }}>{func}</div>
            <div style={{ fontSize: 12 }}>{step.latency.toFixed(1)} ms</div>
          </div>
        ),
      },
      position: { x: idx * 180, y: 100 },
      style: {
        background: getColor(step.latency),
        color: "#fff",
        borderRadius: 8,
        padding: 8,
        minWidth: 120,
        border: "2px solid #333",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  // Connect each node to the next and the previous
  const edges: Edge[] = trace.slice(1).map((_, idx) => ({
    id: `e${idx}-${idx + 1}`,
    source: String(idx),
    target: String(idx + 1),
    animated: true,
    style: {
      stroke: "#888",
      strokeWidth: 2,
      strokeLinecap: "round",
      margin: 10,
    },
    markerStart: { type: "arrowclosed" as MarkerType },
    markerEnd: { type: "arrowclosed" as MarkerType },
    type: "floating",
    zIndex: 1000,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: 250,
        background: "#f9fafb",
        borderRadius: 12,
        padding: 8,
      }}
    >
      {title && <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag={true}
        zoomOnScroll={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={16} color="#eee" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
