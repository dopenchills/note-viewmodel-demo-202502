import { computed, ComputedRef, ref } from 'vue'
import { IViewModel } from 'shared__view-models'
import { Observable } from 'rxjs'

/**
 * PickObservableProps
 * - Type Arguments
 *  - ViewModel that implements IViewModel
 * - Returns a type that represents the Observable properties of the ViewModel
 * - Returns never if the props are not Observable
 */
type PickObservableProps<VM> = {
  [K in keyof VM as VM[K] extends Observable<any> ? K : never]: VM[K]
}

/**
 * useObservableProps
 * - Arguments
 *  - ViewModel that implements IViewModel
 *  - Observable property name of ViewModel, inferrable from ViewModel
 * - Returns a Vue computed ref that updates when the Observable nexts a value
 */
export const useObservableProps = <
  VM extends IViewModel,
  Key extends keyof PickObservableProps<VM>,
  PickedPropType extends PickObservableProps<VM>[Key]
>(
  viewModel: VM,
  propertyName: Key
): ComputedRef<PickedPropType> => {
  const observable = viewModel[propertyName] as Observable<PickedPropType>
  const refProperty = ref<PickedPropType | undefined>(undefined)

  observable.subscribe(value => {
    refProperty.value = value
  })

  const computedProperty = computed<PickedPropType>(() => refProperty.value)

  return computedProperty
}
