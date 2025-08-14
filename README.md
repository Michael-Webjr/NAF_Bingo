# Customer Care Bingo Challenge

A fun and interactive bingo game designed for customer care teams to track their daily tasks and accomplishments. Each player gets a unique bingo card with 24 different tasks plus a free space, and progress is automatically saved to their device.

## Features

- **Unique Cards**: 50 different pre-generated card layouts ensure each player gets a unique experience
- **Auto-Save Progress**: Player progress is automatically saved to their device using localStorage
- **Mobile Responsive**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Visual Patterns**: Shows winning bingo patterns including lines, diagonals, corners, and special shapes
- **Save to Device**: Players can download their completed bingo card as an image
- **Progress Tracking**: Real-time progress bar and statistics

## Tasks Included

The bingo game includes 24 different customer care tasks:
- CCACHR Task
- Trusted Translations
- SRVTRF sercode
- Assumptions Script
- CHKGEN sercode
- QRPC
- FEEGEN sercode
- PMI SCRIPT
- Payoff Script
- Setup a PTP
- Escrow Waiver Script
- Imaged a document to sci
- SLRECA task
- Recognize Someone
- Outbound Dialer Call
- Reissued a check
- SII Script
- Trnsfr for Matic or Retention offer
- CCADCH
- Wrike Request
- Added an A3P
- ESCANA Task
- CCINFO used
- Guided brw to doc center or forms

## Setup Instructions

### 1. Create Your GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `customer-care-bingo` or `bingo-challenge`
3. Make sure it's set to **Public** if you want to use GitHub Pages

### 2. Upload the Files

Create these files in your repository:

- `index.html` (main game page)
- `styles.css` (all styling)
- `script.js` (game logic)
- `README.md` (this documentation)

### 3. Enable GitHub Pages

1. Go to your repository **Settings**
2. Scroll down to **Pages** section
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be available at: `https://yourusername.github.io/your-repo-name`

## File Structure

```
your-repo/
├── index.html          # Main game page with all HTML structure
├── styles.css          # Complete CSS styling and responsive design
├── script.js           # Game logic, card generation, and save functionality
└── README.md           # Project documentation
```

## How to Play

1. **Enter Your Name**: Players enter their first and last name to start
2. **Read the Rules**: Review and agree to the ground rules
3. **Play Bingo**: Complete tasks and enter 10-digit loan numbers
4. **Track Progress**: Watch your progress bar fill up as you complete tasks
5. **Win**: Complete any valid bingo pattern to win!

## Winning Patterns

The game supports multiple winning patterns:
- **5 in a Row**: Horizontal, vertical, or diagonal lines
- **Four Corners**: All four corner squares
- **X Pattern**: Both diagonals completed
- **Full Card**: All 25 squares completed
- **Special Shapes**: L-shape, T-shape, Plus sign, Border

## Technical Details

### Device-Specific Cards
- Each device gets a unique card based on browser fingerprinting
- 50 different card layouts are pre-generated
- Cards remain consistent for the same device

### Progress Saving
- Progress is saved to localStorage automatically
- Players can reset their progress if needed
- Save functionality works offline

### Responsive Design
- Optimized for all screen sizes
- Touch-friendly interface for mobile devices
- Adaptive layouts for different viewports

## Customization

### Adding New Tasks
Edit the `allTasks` array in `script.js`:
```javascript
const allTasks = [
    "Your new task here",
    // ... existing tasks
];
```

### Changing Colors
Modify the CSS color variables in `styles.css`:
```css
/* Main gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjusting Card Count
Change the number of generated cards in `script.js`:
```javascript
// Generate more or fewer unique cards
for (let cardNum = 0; cardNum < 50; cardNum++) {
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Uses localStorage for progress saving

## Troubleshooting

### Cards Not Saving
- Ensure JavaScript is enabled
- Check if localStorage is available
- Try refreshing the page

### Mobile Display Issues
- The game is fully responsive
- If text appears small, try landscape mode
- Clear browser cache if styling looks wrong

### Image Save Not Working
- The game uses html2canvas library for image generation
- If automatic save fails, take a screenshot manually
- Ensure pop-ups are allowed for download

## Contributing

Feel free to fork this project and customize it for your team's needs. Some ideas for improvements:

- Add more task categories
- Implement team leaderboards
- Add sound effects
- Create themed variations
- Add calendar integration

## License

This project is open source and available for modification and distribution.

## Support

For questions or issues, please create an issue in the GitHub repository or contact your development team.
