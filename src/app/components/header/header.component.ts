import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../models/category';
import { CategoryStateService } from '../../services/category-state.service';
import { btoaUnicode, atobUnicode } from '../../utils/url-utils';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    catState = inject(CategoryStateService);

    isDarkTheme = false;
    categories: Category[] = [];
    scheduleConfig: Record<string, unknown> = {};
    tournamentLocation = '';
    scheduleState: Record<string, unknown> = {};

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        const body = document.documentElement;
        if (this.isDarkTheme) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    }

    setTestData() {
        const categories: Category[] = [
            {
                id: Date.now() + Math.random(),
                name: 'Category A',
                teams: ['Pardubice', 'Hradec Králové', 'Brno', 'Praha', 'Plzeň'],
                numberOfFields: 1,
                displayMatrix: []
            },
            {
                id: Date.now() + Math.random(),
                name: 'Category B',
                teams: ['Olomouc', 'Liberec', 'Ostrava', 'Zlín', 'Jihlava', 'Karlovy Vary'],
                numberOfFields: 1,
                displayMatrix: []
            }
        ];
        this.catState.setCategories(categories);
    }

    copyShareUrl() {
        const state = {
            categories: this.categories,
            scheduleStart: this.scheduleConfig['scheduleStart'],
            scheduleEnd: this.scheduleConfig['scheduleEnd'],
            scheduleInterval: this.scheduleConfig['scheduleInterval'],
            scheduleFields: this.scheduleConfig['fields'],
            tournamentLocation: this.tournamentLocation,
            // Add schedule state
            scheduledGames: this.scheduleState['scheduledGames'],
            unassignedGames: this.scheduleState['unassignedGames']
        };
        const json = JSON.stringify(state);

        console.log('Creating shareable URL with state:', state);
        const encoded = btoaUnicode(json);
        const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url);
                console.log('Shareable URL copied to clipboard!');
            }
        } catch (e) {
            // Gracefully handle clipboard errors
            console.error('Clipboard error:', e);
        }
    }

    importFromUrl() {
    const encoded = window.prompt('Paste the base64-encoded setup:');
    if (!encoded) return;
    try {
      const decoded = atobUnicode(encoded);
      const categories = JSON.parse(decoded);
      this.catState.setCategories(categories);
    } catch {
      alert('Failed to import setup.');
    }
  }

}
