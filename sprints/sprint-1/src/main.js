import Reveal from 'reveal.js'
import 'reveal.js/reveal.css'
import './theme.css'

const deck = new Reveal({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  transition: 'none',
  width: 1200,
  height: 675,
  margin: 0.06,
})

deck.initialize()
