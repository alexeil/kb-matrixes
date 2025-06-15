import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isDarkTheme = false;
    @Output() themeToggle = new EventEmitter<void>();

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const body = document.documentElement;
        if (this.isDarkTheme) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    }
}
