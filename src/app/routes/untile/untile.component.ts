import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import JSZip from 'jszip';
import { ButtonModule } from 'primeng/button';
import { DragDropModule } from 'primeng/dragdrop';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

interface Character {
  filename: string;
  image: string;
}
const face = {
  width: 624,
  height: 804,
};
@Component({
  selector: 'app-untile',
  imports: [FileUploadModule, CommonModule, DragDropModule, ButtonModule],
  templateUrl: './untile.component.html',
})
export class UntileComponent {
  bg?: string;
  characters: Character[] = [];
  draggedRank: number = 0;
  constructor() {
    if (localStorage.getItem('bg')) this.bg = localStorage.getItem('bg')!;
  }
  loadBg = (event: FileUploadHandlerEvent) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.files[0]);
    fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
      this.bg = readerEvent.target!.result!.toString();
      localStorage.setItem('bg', this.bg);
    };
  };
  convert = (preview: HTMLImageElement, width?: number, height?: number) => (width ? (width * preview.width) / preview.naturalWidth : height ? (height * preview.height) / preview.naturalHeight : 0);
  loadCharacters = (event: FileUploadHandlerEvent) => {
    this.characters = [];
    let promises: Promise<Character>[] = [];
    for (let file of event.files) {
      promises.push(
        new Promise<Character>((resolve) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onloadend = (readerEvent: ProgressEvent<FileReader>) => resolve({ filename: file.name, image: readerEvent.target!.result!.toString() });
        }),
      );
    }
    Promise.all(promises).then((characters) => {
      this.characters = characters;
      if (localStorage.getItem('order')) {
        const order: string[] = JSON.parse(localStorage.getItem('order')!);
        this.characters.sort((a, b) => order.indexOf(a.filename) - order.indexOf(b.filename));
      }
    });
  };
  onDragStart(index: number) {
    this.draggedRank = index;
  }
  onDrop(dropIndex: number) {
    const character = this.characters[this.draggedRank];
    this.characters.splice(this.draggedRank, 1);
    this.characters.splice(dropIndex, 0, character);
  }
  generate = () => {
    localStorage.setItem('order', JSON.stringify(this.characters.map((character) => character.filename)));
    let canvas = document.createElement('canvas');
    let background = document.getElementById('bg') as HTMLImageElement;
    canvas.width = background.naturalWidth;
    canvas.height = background.naturalHeight;
    canvas.getContext('2d')!.drawImage(background, 0, 0);
    let cols = Math.min(this.characters.length, 7);
    let rows = cols < 7 ? 1 : Math.ceil(this.characters.length / cols);
    let crop: { width: number; height: number; offsetX: number; offsetY: number } = { width: 0, height: 0, offsetX: 0, offsetY: 0 };
    const convert = ({ width, height }: { width?: number; height?: number }) => (width ? (width * face.height) / face.width : height ? (height * face.width) / face.height : 0);
    if (background.naturalHeight > convert({ width: background.naturalWidth / cols }) * rows) {
      crop.width = background.naturalWidth / cols;
      crop.height = convert({ width: crop.width });
      crop.offsetY = (background.naturalHeight - crop.height * rows) / 2;
    } else {
      crop.height = background.naturalHeight / rows;
      crop.width = convert({ height: crop.height });
      crop.offsetX = (background.naturalWidth - crop.width * cols) / 2;
    }
    console.log(crop);
    let line = 0;
    let column = 0;
    const zip = new JSZip();
    for (let character of this.characters) {
      let buffer = document.createElement('canvas');
      buffer.width = face.width;
      buffer.height = face.height;
      buffer.getContext('2d')!.drawImage(canvas, column * crop.width + crop.offsetX, line * crop.height + crop.offsetY, crop.width, crop.height, 0, 0, face.width, face.height);
      zip.file(character.filename, buffer.toDataURL().split(',')[1], { base64: true });
      if (column === cols - 1) {
        column = 0;
        line++;
      } else column++;
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'characters.zip';
      a.click();
      URL.revokeObjectURL(url);
    });
  };
}
