import { reactive, defineComponent } from 'vue'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import { render, queries, cleanup, fireEvent, screen } from '@testing-library/vue'
import BarChart from '../components/BarChart.vue'

const setOption = vi.fn()
const resize = vi.fn()

vi.mock('echarts', () => ({
	init: () => ({
		setOption,
		resize
	})
}))

beforeEach(() => {
  cleanup()
  setOption.mockClear()
  resize.mockClear()
})

const MockOperator = defineComponent({
  components: { BarChart },
  template: /*vue-html*/`
  <div>
		<BarChart :width="data.width" :height="data.height" />
		<button @click="data.width += 100">AddWidth</button>
	</div>
  `,
  setup() {
    const data = reactive({
      width: 600,
      height: 400,
    })
    return { data }
  }
})


describe('render', () => {
  test('base', () => {
    const { getByTestId } = render(BarChart, {
      queries
    })
    const el = getByTestId('chart')
    expect(el).toBeDefined()
    expect(el.style.width).toBe('600px')
    expect(el.style.height).toBe('400px')
    expect(setOption).toHaveBeenCalledTimes(1)
    expect(resize).toHaveBeenCalledTimes(0)
  })
  test('resize',async () => {
    render(MockOperator)
    const { getByText, getByTestId } = screen
    const el = getByTestId('chart')
    expect(el).toBeDefined()
    expect(el.style.width).toBe('600px')
    expect(el.style.height).toBe('400px')
    expect(setOption).toHaveBeenCalledTimes(1)
    expect(resize).toHaveBeenCalledTimes(0)
    const btn = getByText('AddWidth')
    await fireEvent.click(btn)
    expect(resize).toHaveBeenCalledTimes(1)
    expect(el.style.width).toBe('700px')
  })
})
