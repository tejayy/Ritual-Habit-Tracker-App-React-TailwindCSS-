# LifeOS - Daily Rituals Tracker

## 🎉 New Features Implemented

### ✅ Quick Wins Features

#### 1. **Search & Filter Rituals**
- **Search Bar**: Quickly find rituals by name or description
- **Real-time filtering**: Results update as you type
- **Category Filters**: Filter rituals by category with one click
- **"All" button**: Reset filters to see all rituals

#### 2. **Archive System**
- **Archive Button**: Hide completed or inactive rituals without deleting them
- **Toggle View**: Switch between active and archived rituals
- **Preserve Data**: All completion history is maintained when archiving
- **Easy Restoration**: Unarchive rituals with a single click

#### 3. **Undo Button**
- **Undo Last Action**: Accidentally marked a ritual as complete? Undo it!
- **10-Action History**: Keeps track of your last 10 check-ins
- **Visual Indicator**: Button only appears when undo is available
- **Smart Tracking**: Remembers both completion and un-completion actions

#### 4. **Confetti Animation** 🎊
- **Celebration**: Triggers when you complete ALL rituals for the day
- **Beautiful Animation**: Multi-burst confetti effect
- **Motivational**: Makes completing your daily rituals feel rewarding
- **Performance Optimized**: Smooth animation that doesn't slow down the app

#### 5. **Markdown Support**
- **Rich Formatting**: Use markdown in ritual descriptions
- **Supported Syntax**:
  - `**bold text**` for emphasis
  - `*italic text*` for style
  - `` `code` `` for technical notes
- **Live Rendering**: Markdown is rendered beautifully in the UI

#### 6. **Duplicate Ritual**
- **Quick Copy**: Duplicate any ritual with one click
- **Smart Naming**: Automatically adds "(Copy)" to the name
- **Fresh Start**: New ritual starts with zero completions
- **Hover Action**: Button appears when hovering over a ritual card

#### 7. **Print View**
- **Physical Checklist**: Generate a printable version of your rituals
- **Clean Layout**: Optimized for printing on paper
- **Organized by Category**: Groups rituals by category for easy scanning
- **Checkbox Format**: Empty checkboxes ready to be marked by hand
- **Print Button**: Located in the navigation bar

---

### 🎯 Phase 1 Features

#### 1. **Categories/Tags System**
- **Organize Rituals**: Assign categories like "Morning", "Evening", "Health", "Work"
- **Visual Tags**: Categories displayed as colored badges on ritual cards
- **Filter by Category**: Quick filter buttons to view specific categories
- **Optional Field**: Categories are optional when creating rituals

#### 2. **Drag & Drop Reordering**
- **Custom Order**: Drag rituals to reorder them
- **Visual Feedback**: Cards become semi-transparent while dragging
- **Grab Handle**: Dedicated drag handle (≡ icon) on each card
- **Persistent Order**: Your custom order is saved automatically
- **Touch Support**: Works on mobile devices too

#### 3. **Weekly View & Statistics**
- **14-Day Heatmap**: Visual representation of your consistency
- **Color Intensity**: Darker colors = more rituals completed
- **Weekly Percentage**: Shows your consistency rate for the past 7 days
- **Hover Effects**: Interactive squares that scale on hover

#### 4. **Enhanced Progress Tracking**
- **Today's Progress**: Large card showing completed/total rituals
- **Animated Progress Bar**: Smooth gradient progress indicator
- **Reflection Section**: Dynamic messages based on your progress
- **Streak Counter**: Fire emoji (🔥) with day count for each ritual

---

## 🌓 Dark/Light Mode

- **Toggle Button**: Sun/moon icon in the navigation bar
- **System Preference**: Automatically detects your OS theme preference
- **Persistent**: Your choice is saved in localStorage
- **Smooth Transitions**: Beautiful color transitions between modes
- **Complete Theme**: All components adapt to the selected mode

---

## 🎨 Design Improvements

### Color Palette
- **Light Mode**: Warm terracotta/orange accents on cream background
- **Dark Mode**: Rich dark tones with vibrant orange highlights
- **Consistent**: Uses CSS custom properties for easy theming

### Typography
- **Playfair Display**: Elegant serif font for headings
- **Poppins**: Clean sans-serif for body text
- **Hierarchy**: Clear visual distinction between heading levels

### UI/UX Enhancements
- **Rounded Corners**: Soft 32px radius on cards
- **Hover Effects**: Subtle lift and shadow on interactive elements
- **Smooth Animations**: 300ms transitions throughout
- **Glass Morphism**: Frosted glass effect on navigation
- **Responsive**: Works beautifully on mobile, tablet, and desktop

---

## 🚀 How to Use

### Adding a Ritual
1. Click "+ Add Ritual" button
2. Enter ritual name (required)
3. Add description with markdown support (optional)
4. Specify a category (optional)
5. Click "Save Ritual"

### Organizing Rituals
- **Drag to Reorder**: Click and hold the ≡ icon, then drag
- **Filter by Category**: Click category buttons to filter
- **Search**: Type in the search bar to find specific rituals
- **Archive**: Hover over a ritual and click the archive icon

### Tracking Progress
- **Check Off**: Click the circle to mark a ritual as complete
- **Undo**: Click "Undo" button if you made a mistake
- **View Archived**: Toggle "Show Archived" to see hidden rituals
- **Print**: Click "Print" in the nav to generate a physical checklist

### Managing Rituals
- **Duplicate**: Hover over a ritual and click the duplicate icon
- **Archive**: Click the archive icon to hide (not delete)
- **Delete**: Click the trash icon to permanently remove
- **Edit Intent**: Click on your intent text to edit it

---

## 🔧 Technical Details

### Dependencies Added
- `canvas-confetti`: Celebration animations
- `react-markdown`: Markdown rendering
- `@dnd-kit/core`: Drag and drop functionality
- `@dnd-kit/sortable`: Sortable list implementation
- `@dnd-kit/utilities`: Helper utilities for DnD

### Data Structure
```typescript
type Habit = {
  id: string;
  name: string;
  detail: string;
  completions: Record<string, boolean>;
  category?: string;
  archived?: boolean;
  order?: number;
};
```

### Storage
- All data stored in `localStorage`
- Dark mode preference saved separately
- Undo stack maintains last 10 actions
- Automatic save on every change

---

## 📱 Keyboard Shortcuts (Future Enhancement)

Coming soon:
- `Space`: Toggle selected ritual
- `N`: New ritual
- `S`: Focus search
- `Ctrl+Z`: Undo
- `P`: Print view

---

## 🎯 Future Enhancements

### Phase 2 (Engagement)
- Time-based reminders with notifications
- Ritual notes/journal entries
- Advanced statistics and charts
- Daily inspirational quotes

### Phase 3 (Power User)
- Data export/backup (CSV, JSON)
- Multiple custom themes
- Ritual templates library
- Offline PWA mode with sync

---

## 💡 Tips for Best Results

1. **Start Small**: Add 3-5 rituals to begin with
2. **Use Categories**: Organize by time of day or life area
3. **Write Good Descriptions**: Use markdown to add context
4. **Review Weekly**: Check your heatmap to spot patterns
5. **Celebrate Wins**: Enjoy the confetti when you complete all rituals!
6. **Archive, Don't Delete**: Keep your history by archiving instead
7. **Print Weekly**: Use print view for offline tracking

---

## 🐛 Known Issues

None currently! Report issues if you find any.

---

## 📄 License

MIT License - Feel free to use and modify!
