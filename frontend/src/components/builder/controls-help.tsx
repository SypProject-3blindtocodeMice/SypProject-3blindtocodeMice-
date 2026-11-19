// import './controls-help-style.css'
//
// const controls = [
//   { keys: ['Left-drag'], action: 'Orbit the camera' },
//   { keys: ['Right-drag'], action: 'Pan the camera' },
//   { keys: ['Scroll'], action: 'Zoom in and out' },
//   { keys: ['←'], action: 'Move wall left' },
//   { keys: ['→'], action: 'Move wall right' },
//   { keys: ['↑'], action: 'Move wall back' },
//   { keys: ['↓'], action: 'Move wall forward' },
//   { keys: ['Shift', '←'], action: 'Turn left' },
//   { keys: ['Shift', '→'], action: 'Turn right' },
//   { keys: ['Shift', '↑'], action: 'Tilt back' },
//   { keys: ['Shift', '↓'], action: 'Tilt forward' },
// ]
//
// // Shows on hover (and on keyboard focus), no clicking needed
// export default function ControlsHelp() {
//   return (
//     <div className="controls-help">
//       <button type="button" className="help-button" aria-label="Controls" aria-describedby="controls-help-popover">
//         ?
//       </button>
//
//       <div id="controls-help-popover" className="help-popover" role="tooltip">
//         <h2>Controls</h2>
//         <ul>
//           {controls.map((control) => (
//             <li key={control.action}>
//               <span className="help-keys">
//                 {control.keys.map((key, index) => (
//                   <span key={key}>
//                     {index > 0 && <span className="help-plus">+</span>}
//                     {key.length <= 5 ? <kbd>{key}</kbd> : <span className="help-mouse">{key}</span>}
//                   </span>
//                 ))}
//               </span>
//               <span className="help-action">{control.action}</span>
//             </li>
//           ))}
//         </ul>
//         <p>Select a wall first to move, turn or tilt it.</p>
//       </div>
//     </div>
//   )
// }
