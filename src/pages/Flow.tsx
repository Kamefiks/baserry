"use client";

import type React from "react";
import { useCallback } from "react";
import { motion } from "framer-motion";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import type { FlowNode, FlowEdge } from "@/types";

const initialNodes: FlowNode[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "default",
    data: { label: "Process Data" },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "default",
    data: { label: "Validate Input" },
    position: { x: 400, y: 125 },
  },
  {
    id: "4",
    type: "output",
    data: { label: "End" },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: FlowEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

const Flow: React.FC = () => {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          React Flow
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Interactive node-based editor and workflow builder
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-0 overflow-hidden"
        style={{ height: "600px" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          // @ts-ignore
          <Background variant={"lines" as any} gap={12} size={1} />
        </ReactFlow>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nodes
          </h3>
          <p className="text-2xl font-bold text-primary-600">{nodes.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Edges
          </h3>
          <p className="text-2xl font-bold text-primary-600">{edges.length}</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connections
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {edges.reduce(
              (acc, edge) => acc + (edge.source !== edge.target ? 1 : 0),
              0,
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Flow;
