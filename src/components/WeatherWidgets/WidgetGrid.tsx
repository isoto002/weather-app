import { HumidityWidget } from './HumidityWidget'
import { WindWidget } from './WindWidget'
import { SunWidget } from './SunWidget'
import { AqiWidget } from './AqiWidget'
import { OutfitWidget } from './OutfitWidget'

export function WidgetGrid() {
  return (
    <section className="px-4 max-w-3xl mx-auto mt-4" aria-live="polite">
      <div className="widget-grid">
        <HumidityWidget />
        <WindWidget />
        <SunWidget />
        <AqiWidget />
        <OutfitWidget />
      </div>
    </section>
  )
}
