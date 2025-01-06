import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

interface pos {
  x: number;
  y: number;
  z: number;
}

interface bdoNode {
  key: number;
  pos: pos;
  kind: number;
  CP: number;
  is_main: number;
  has_lodging: boolean;
  is_planttown: boolean;
  is_plantzone: boolean;
  name: string;
}

@Component({
  selector: 'app-trade',
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './trade.component.html',
})
export class TradeComponent {
  nodes: bdoNode[] = [];
  towns: bdoNode[] = [];
  source: pos;
  distances: { town: string; distance: number }[];
  constructor() {
    fetch('https://raw.githubusercontent.com/shrddr/shrddr.github.io/refs/heads/main/workerman/data/loc.json')
      .then((response) => response.json())
      .then((names) => {
        fetch('https://raw.githubusercontent.com/shrddr/shrddr.github.io/refs/heads/main/workerman/data/exploration.json')
          .then((response) => response.json())
          .then((nodes) => {
            this.nodes = (Object.keys(nodes).map((v) => ({ ...nodes[v], name: names.en.node[v] })) as bdoNode[]).filter((node) => node.is_main).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            this.towns = this.nodes.filter((node) => node.is_planttown);
          });
      });
  }

  getDistances = (source: pos) => {
    this.distances = this.towns
      .map((town) => ({
        town: town.name,
        distance: Math.min(150, Math.sqrt((town.pos.x - source.x) ** 2 + (town.pos.y - source.y) ** 2 + (town.pos.z - source.z) ** 2) / 100 / 150),
      }))
      .sort((a, b) => b.distance - a.distance);
  };
}
