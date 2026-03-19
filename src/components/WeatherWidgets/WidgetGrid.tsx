import { HumidityWidget } from './HumidityWidget'
import { WindWidget } from './WindWidget'
import { SunWidget } from './SunWidget'
import { AqiWidget } from './AqiWidget'
import { OutfitWidget } from './OutfitWidget'

export function WidgetGrid() {
  return (
    <section className="px-4 max-w-3xl mx-auto mt-4">
      <div className="grid grid-cols-2 gap-3">
        <HumidityWidget />
        <WindWidget />
        <SunWidget />
        <AqiWidget />
        <OutfitWidget />
      </div>
    </section>
  )
}
