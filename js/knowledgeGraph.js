// AptiLearn AI Interactive Concept Knowledge Graph (Canvas / SVG Renderer)
import { SYLLABUS_CONCEPTS } from './config.js';
import { store } from './state.js';
import { LearnerModelEngine } from './learnerModel.js';

export class KnowledgeGraphVisualizer {
  constructor(canvasElement, onNodeClick) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onNodeClick = onNodeClick;

    // Viewport transform
    this.scale = 0.95;
    this.panX = 20;
    this.panY = 10;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.hoveredNode = null;
    this.selectedNodeId = null;

    // Node layout positions
    this.nodes = SYLLABUS_CONCEPTS.map(c => ({
      ...c,
      radius: 35
    }));

    this.initEvents();
    this.resize();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = Math.max(560, rect.height) * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${Math.max(560, rect.height)}px`;
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    // Mouse drag & pan
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const clicked = this.findNodeAt(mouseX, mouseY);
      if (clicked) {
        this.selectedNodeId = clicked.id;
        if (this.onNodeClick) this.onNodeClick(clicked);
        this.render();
      } else {
        this.isDragging = true;
        this.dragStartX = mouseX - this.panX;
        this.dragStartY = mouseY - this.panY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        this.panX = mouseX - this.dragStartX;
        this.panY = mouseY - this.dragStartY;
        this.render();
      } else if (rect.top <= e.clientY && e.clientY <= rect.bottom && rect.left <= e.clientX && e.clientX <= rect.right) {
        const found = this.findNodeAt(mouseX, mouseY);
        if (found !== this.hoveredNode) {
          this.hoveredNode = found;
          this.canvas.style.cursor = found ? 'pointer' : 'grab';
          this.render();
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Zoom on wheel
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.scale = Math.max(0.5, Math.min(2.0, this.scale * zoomFactor));
      this.render();
    }, { passive: false });
  }

  zoomIn() {
    this.scale = Math.min(2.0, this.scale * 1.15);
    this.render();
  }

  zoomOut() {
    this.scale = Math.max(0.5, this.scale * 0.85);
    this.render();
  }

  resetView() {
    this.scale = 0.95;
    this.panX = 20;
    this.panY = 10;
    this.render();
  }

  findNodeAt(screenX, screenY) {
    const worldX = (screenX - this.panX) / this.scale;
    const worldY = (screenY - this.panY) / this.scale;

    for (const node of this.nodes) {
      const dx = node.x - worldX;
      const dy = node.y - worldY;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius) {
        return node;
      }
    }
    return null;
  }

  getNodeColor(node) {
    const user = store.currentUser;
    const mastery = user && user.mastery ? (user.mastery[node.id] ?? 0) : 0;
    const stats = user && user.conceptStats ? user.conceptStats[node.id] : null;
    const attempts = stats ? stats.attempts : 0;

    const status = LearnerModelEngine.getConceptStatus(mastery, attempts);

    if (status === "Mastered") {
      return { fill: "#064e3b", stroke: "#10b981", text: "#34d399", glow: "rgba(16, 185, 129, 0.4)", status };
    } else if (status === "Learning") {
      return { fill: "#451a03", stroke: "#f59e0b", text: "#fbbf24", glow: "rgba(245, 158, 11, 0.35)", status };
    } else if (status === "Needs Improvement") {
      return { fill: "#4c0519", stroke: "#f43f5e", text: "#fb7185", glow: "rgba(244, 63, 94, 0.4)", status };
    } else {
      return { fill: "#1e293b", stroke: "#64748b", text: "#94a3b8", glow: "rgba(100, 116, 139, 0.2)", status };
    }
  }

  render() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(560, rect.height);
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw prerequisite dependency edges
    this.nodes.forEach(node => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach(prereqId => {
          const source = this.nodes.find(n => n.id === prereqId);
          if (source) {
            this.drawEdge(ctx, source, node);
          }
        });
      }
    });

    // 2. Draw nodes
    this.nodes.forEach(node => {
      this.drawNode(ctx, node);
    });

    ctx.restore();
  }

  drawEdge(ctx, source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx);

    const startX = source.x + Math.cos(angle) * source.radius;
    const startY = source.y + Math.sin(angle) * source.radius;
    const endX = target.x - Math.cos(angle) * (target.radius + 6);
    const endY = target.y - Math.sin(angle) * (target.radius + 6);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 2.0;
    ctx.stroke();

    const arrowSize = 7;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle - Math.PI / 6),
      endY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - arrowSize * Math.cos(angle + Math.PI / 6),
      endY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(56, 189, 248, 0.55)";
    ctx.fill();
  }

  drawNode(ctx, node) {
    const colors = this.getNodeColor(node);
    const user = store.currentUser;
    const mastery = user && user.mastery ? (user.mastery[node.id] ?? 0) : 0;
    const isSelected = this.selectedNodeId === node.id;
    const isHovered = this.hoveredNode && this.hoveredNode.id === node.id;

    ctx.save();

    if (isSelected || isHovered || colors.status === "Needs Improvement") {
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = isSelected ? 22 : 12;
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = colors.fill;
    ctx.fill();

    ctx.lineWidth = isSelected ? 3.5 : 2.0;
    ctx.strokeStyle = isSelected ? "#ffffff" : colors.stroke;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Progress arc
    if (mastery > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * (mastery / 100));
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 3, startAngle, endAngle);
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.shortName, node.x, node.y - 6);

    // Mastery %
    ctx.fillStyle = colors.text;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText(`${mastery}%`, node.x, node.y + 11);

    ctx.restore();
  }
}
