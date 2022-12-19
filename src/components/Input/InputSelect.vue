<template>
    <Dropdown
        ref="dropdown"
        full
        class="input-select"
        :class="{
            'input-select--inline': inline,
            'input-select--small': small,
            'input-select--large': large,
            'input-select--search': isSearch,
            'input-select--disabled': disabled,
        }"
        :teleport="teleport"
        @click-outside="handleClickOutside"
    >
        <template #toggle>
            <div
                v-if="!isSearch"
                class="input-select__value"
                tabindex="0"
                @mousedown="toggle"
                @focus="onInputFocus"
                @blur="onInputBlur"
                @keydown="onKeydown"
                @keyup="onKeyup"
            >
                <slot
                    name="result"
                    v-bind="{
                        option: selectedOption,
                        options: selectedOptions,
                    }"
                >
                    <template v-if="selectedOption && selectedOptions.length <= 1">
                        <img
                            v-if="selectedOption.image"
                            :src="selectedOption.image"
                            :alt="selectedOption.title"
                            class="input-select__image"
                        >

                        <div class="input-select__value__text">
                            <div class="input-select__value__text__title">
                                {{ selectedOption.title }}
                            </div>

                            <div
                                v-if="selectedOption.subtitle !== undefined && selectedOption.subtitle !== null"
                                class="input-select__value__text__subtitle"
                            >
                                {{ selectedOption?.subtitle }}
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="input-select__value__text">
                            <div class="input-select__value__text__title">
                                {{ selectedOptionsResult }}
                            </div>
                        </div>
                    </template>
                    <div class="input-select__arrow">
                        <Icon icon="fa-solid fa-chevron-down" />
                    </div>
                </slot>
            </div>

            <slot
                v-if="isSearch"
                name="input"
                v-bind="{ query, value, option: selectedOption }"
            >
                <input
                    ref="input"
                    type="text"
                    class="input-select__input"
                    autocomplete="off"
                    :value="query"
                    :placeholder="!autocomplete ? placeholder : null"
                    :disabled="disabled"
                    @input="updateQuery"
                    @mousedown="toggle"
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                    @keydown="moveFocus"
                    @keydown.tab="onTab"
                    @keyup="onKeyup($event, false)"
                >

                <div
                    v-if="autocomplete?.length"
                    class="input-select__placeholder"
                    :class="{
                        'input-select__placeholder--autocomplete': !!autocompletedOption
                    }"
                >
                    {{ autocomplete }}
                </div>

                <div v-if="loading" class="input-select__loader">
                    <Loader />
                </div>
                <div
                    v-else-if="clearButton && query.length && !freeInput"
                    class="input-select__clear"
                    @click="onClearClick"
                >
                    <Icon icon="fa-solid fa-times" />
                </div>
                <div v-else class="input-select__arrow">
                    <Icon icon="fa-solid fa-chevron-down" />
                </div>
            </slot>
        </template>

        <template #content>
            <div
                v-if="!(isSearch && !optionsToRender.length && freeInput)"
                ref="optionsContainer"
                class="input-select__options"
                role="listbox"
            >
                <div
                    v-for="(option, $i) in optionsToRender"
                    :key="$i"
                    role="option"
                >
                    <div
                        v-if="hasGroup(option) && (!optionsToRender[$i-1] || optionsToRender[$i-1]?.group !== option.group)"
                        class="input-select__option input-select__option--group"
                    >
                        <div class="input-select__option__text">
                            <div class="input-select__option__text__title">
                                {{ option.group }}
                            </div>
                        </div>
                    </div>
                    <div
                        class="input-select__option"
                        :class="[{
                            'input-select__option--selected': isSelected($i),
                            'input-select__option--focused': isFocused($i),
                            'input-select__option--in-group': hasGroup(option),
                        }, option.classes]"
                        @click="select(option, $i, $event.shiftKey)"
                    >
                        <img
                            v-if="option?.image"
                            :src="option.image"
                            :alt="option.title"
                            class="input-select__option__image"
                        >

                        <div class="input-select__option__text">
                            <div class="input-select__option__text__title">
                                {{ option.title }}
                            </div>

                            <div
                                v-if="option.subtitle !== undefined && option.subtitle !== null"
                                class="input-select__option__text__subtitle"
                            >
                                {{ option?.subtitle }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isSearch && !optionsToRender.length" class="input-select__options__no-results">
                    <template v-if="search && !query.length">
                        Start typing ...
                    </template>
                    <template v-else>
                        {{ noResultsText }}
                    </template>
                </div>
            </div>
        </template>
    </Dropdown>
</template>

<script setup lang="ts">
    import SelectOption from "~/types/models/SelectOption"

    import {
        computed,
        nextTick,
        onMounted,
        ref,
        watch,
    } from "vue"
    import { useDebounceFn } from "@vueuse/core"

    const props = withDefaults(defineProps<{
        modelValue: any,
        options: SelectOption[],
        withEmpty?: boolean | string | SelectOption,
        teleport?: boolean | string,
        inline?: boolean,
        small?: boolean,
        large?: boolean,
        clearButton?: boolean,
        freeInput?: boolean,
        limit?: number | false,
        disabled?: boolean,
        multiple?: boolean,

        // Search props
        search?: boolean,
        filter?: boolean,
        loading?: boolean,
        debounce?: boolean | number,
        placeholder?: string,
        noResultsText?: string,
    }>(), {
        teleport: false,
        withEmpty: false,
        inline: false,
        small: false,
        large: false,
        clearButton: false,
        freeInput: false,
        limit: false,
        disabled: false,
        multiple: false,

        // Search props
        search: false,
        filter: false,
        loading: false,
        debounce: false,
        placeholder: null,
        noResultsText: 'No results',
    })

    const emit = defineEmits([
        'update:modelValue', //
        'change',
        'open',
        'close',
        'focus',
        'blur',
        'focusMove',
        'search',
        'clear',
        'keydown',
    ])

    // Refs declaration
    // ================

    const dropdown = ref(null)
    const input = ref(null)
    const optionsContainer = ref(null)

    // Opened state manipulation
    // ================

    const isActive = computed(() => dropdown.value?.isActive)

    const open = () => {
        if (!dropdown.value || props.disabled) {
            return
        }

        if (!isActive.value) {
            dropdown.value.open()

            emit('open')

            nextTick(() => {
                const selected = dropdown.value.$el.querySelector('.input-select__option--selected')

                if (selected) {
                    optionsContainer.value.scrollTop = selected.offsetTop - optionsContainer.value.clientHeight / 2
                }
            })
        }
    }

    const close = () => {
        if (!dropdown.value) {
            return
        }

        if (isActive.value) {
            dropdown.value.close()

            emit('close')
        }
    }

    const toggle = () => {
        if (dropdown.value?.isActive) {
            close()
        } else {
            open()
        }
    }

    // Handle options
    // ================

    const value = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        },
    })

    const selectedIndex = ref(null)

    const getIndexOfSelectedValue = () => {
        if (props.multiple) {
            return 0
        }

        if (selectedIndex.value !== null) {
            return selectedIndex.value
        }

        return options.value.findIndex(option => option.value === value.value)
    }

    const selectedOption = computed<SelectOption>(() => {
        return options.value[getIndexOfSelectedValue()] ?? null
    })

    const selectedOptions = computed<SelectOption[]>(() => {
        if (!Array.isArray(value.value)) {
            return []
        }

        return options.value.filter(option => value.value.includes(option.value))
    })

    const selectedOptionsResult = computed(() => {
        if (!selectedOptions.value.length) {
            return ''
        }

        const result = selectedOptions.value.map(option => option.title).join(', ')

        return (selectedOptions.value.length > 1 ? `(${selectedOptions.value.length}) ` : '') + result
    })

    const emptyOptionValue: SelectOption = {
        title: '--------',
        value: null,
    }

    const options = computed(() => {
        let options = props.options.map(option => {
            if (!('title' in option)) {
                // @ts-ignore
                option.title = option.value
            }

            return option
        })

        if (props.filter) {
            const searchQuery = String(query.value).toLowerCase()

            if (searchQuery.length >= 1) {
                options = options.filter((option) => {
                    return String(option.title).toLowerCase().includes(searchQuery)
                        || String(option.value).toLowerCase().includes(searchQuery)
                        || (option.subtitle && String(option.subtitle).toLowerCase().includes(searchQuery))
                })
            }
        }

        if (props.withEmpty) {
            let empty = emptyOptionValue

            if (typeof props.withEmpty === 'object') {
                empty = props.withEmpty
            } else if (typeof props.withEmpty === 'string') {
                empty.title = props.withEmpty
            }

            options = [
                empty,
                ...options,
            ]
        }

        if (sort.value) {
            options = options.sort((a, b) => (a.sort || 0) - (b.sort || 0))
        }

        if (group.value) {
            options = options.sort((a, b) => {
                if (!a.group || !b.group) {
                    return 0
                }

                return a.group.localeCompare(b.group)
            })
        }

        return options
    })

    const optionsToRender = computed(() => {
        if (typeof props.limit === 'number') {
            return options.value.slice(0, props.limit)
        }

        return options.value
    })

    watch(value, (value) => {
        if (props.multiple && Array.isArray(value) && !selectedOptions.value.every(option => value.includes(option.value))) {
            selectedIndex.value = null
        } else if (value !== selectedOption.value?.value) {
            selectedIndex.value = null
        }
    })

    // Group
    const group = computed(() => props.options.some(hasGroup))
    const hasGroup = (option) => 'group' in option && option.group !== null && option.group !== ''

    // Sort
    const sort = computed(() => props.options.some(option => 'sort' in option))

    //

    const selectValue = (newValue, append = false) => {
        if (props.multiple) {
            if (newValue === null || newValue === undefined) {
                newValue = append ? value.value : null
            } else if (Array.isArray(value.value) && append) {
                if (isSelectedValue(newValue)) {
                    newValue = value.value.filter(v => v !== newValue)
                } else {
                    newValue = [...value.value, newValue]
                }
            } else {
                newValue = [newValue]
            }
        }

        value.value = newValue
    }


    const selectValueIndex = (index, append = false) => {
        if (props.withEmpty && append && index === 0) {
            return
        }

        if (props.multiple && index !== null) {
            if (Array.isArray(selectedIndex.value) && append) {
                if (isSelected(index)) {
                    index = selectedIndex.value.filter(v => v !== index)
                } else {
                    index = [...selectedIndex.value, index]
                }
            } else {
                index = [index]
            }

            if (props.withEmpty && index.length > 1) {
                index = index.filter(v => v !== 0)
            }
        }

        selectedIndex.value = index
    }

    const select = (option, index = null, append = false) => {
        selectValue(option?.value, append)
        selectValueIndex(index, append)

        if (!append) {
            query.value = ''
            focused.value = index !== null ? index : -1
            close()
        }
    }

    const selectByIndex = (index, append = false) => {
        if (!options.value[index]) {
            select(null)
            return
        }

        select(options.value[index], index, append)
    }

    const selectAutocompleted = (append = false) => {
        if (!autocompletedOption.value) {
            return
        }

        select(autocompletedOption.value, null, append)
    }

    const isSelected = (index) => {
        // if (props.withEmpty && index === 0) {
        //     return false
        // }

        const option = options.value[index]

        if (!option) {
            return false
        }

        const optionValue = option.value

        // Multiple values
        if (props.multiple) {
            if (selectedIndex.value !== null) {
                return selectedIndex.value.includes(index)
            }

            return value.value?.includes(optionValue)
        }

        // Single value
        if (selectedIndex.value !== null) {
            return index === selectedIndex.value
        }

        return optionValue === selectedOption.value?.value
    }

    const isSelectedValue = (optionValue) => {
        if (props.multiple) {
            return value.value?.includes(optionValue)
        }

        return optionValue === selectedOption.value?.value
    }

    const onTab = (event: KeyboardEvent) => {
        if (autocompletedOption.value && autocompletedOption.value.value !== query.value) {
            event.preventDefault()
            selectAutocompleted(event.shiftKey)
        }
    }

    const onKeydown = (event: KeyboardEvent) => {
        moveFocus(event)

        emit('keydown', event)
    }

    const onKeyup = (event: KeyboardEvent, handleSpace = true) => {
        if ((handleSpace && event.code === 'Space') || event.code === 'Enter') {
            event.preventDefault()
            onEnter(event)
        }

        if (event.code === 'ArrowRight') {
            selectAutocompleted(event.shiftKey)
        }

        if (event.code === 'Escape') {
            event.stopPropagation()
            event.stopImmediatePropagation()

            close()

            if (!props.freeInput) {
                clearInputs()
            }
        }
    }

    const onEnter = (event: KeyboardEvent) => {
        if (!isActive.value) {
            open()
            return
        }

        const append = event.shiftKey

        if (hasFocused.value) {
            selectFocused(append)
        } else if (autocompletedOption.value) {
            selectAutocompleted(append)
        } else {
            if (!append) {
                close()
            }
        }
    }

    // Search
    // ================

    const query = ref('')

    const optionCanBeAutocompleted = (option) => {
        return option && option.title.substring(0, query.value.length).toLowerCase() === query.value.toLowerCase()
    }

    const autocompletedOption = computed(() => {
        if (!isActive.value && props.freeInput) {
            return null
        }

        if (focused.value !== -1) {
            const option = options.value[focused.value]

            if (optionCanBeAutocompleted(option)) {
                return option
            }
        }

        if (query.value.length) {
            if (options.value.length) {
                if (props.withEmpty && options.value.length === 1) {
                    return null
                }

                const option = options.value.at((props.withEmpty ? 1 : 0))

                if (optionCanBeAutocompleted(option)) {
                    return option
                }
            }
        }

        return null
    })

    const autocomplete = computed(() => {
        if (autocompletedOption.value) {
            const foundPart = autocompletedOption.value.title.substring(0, query.value.length)

            if (foundPart !== query.value) {
                return query.value + autocompletedOption.value.title.substring(query.value.length)
            }

            return autocompletedOption.value.title
        }

        if (query.value.length) {
            return ''
        }

        return props.multiple ? '' + selectedOptionsResult.value : selectedOption.value?.title
    })

    const isSearch = computed(() => props.search || props.filter)

    const handleSearch = (event) => {
        open()
        emit('search', event.target.value)
    }

    const handleSearchDebounced = props.debounce ? useDebounceFn(
        handleSearch,
        typeof props.debounce === 'boolean' ? 300 : props.debounce,
    ) : handleSearch

    const clearInputs = () => {
        if (query.value.length) {
            query.value = ''
        }

        resetFocus()

        emit('clear')
    }

    const onClearClick = () => {
        close()

        if (!props.freeInput) {
            clearInputs()
        }
    }

    watch(isActive, () => {
        nextTick(() => {
            if (isActive.value) {
                input.value?.focus()
            }
        })
    })

    // Focus manipulation
    // ================
    const focused = ref(-1)

    const resetFocus = () => {
        focused.value = -1
    }

    watch(query, () => {
        resetFocus()
    })

    const focus = () => {
        input.value?.focus()
    }

    const moveFocus = (event) => {
        if (!isActive.value && props.freeInput) {
            return
        }

        if (![38, 40].includes(event.keyCode)) {
            return
        }

        event.preventDefault()

        const resultsCount = options.value.length

        const fromFocus = focused.value

        if (focused.value === -1) {
            focused.value = getIndexOfSelectedValue() ?? -1
        }

        if (event.keyCode === 38) {
            // Up
            focused.value = focused.value <= 0 ? resultsCount - 1 : focused.value - 1
        } else if (event.keyCode === 40) {
            // Down
            focused.value = focused.value + 1 >= resultsCount ? 0 : focused.value + 1
        }

        emit('focusMove', fromFocus, focused.value)
    }

    const selectFocused = (append = false) => {
        selectByIndex(focused.value, append)
    }

    const hasFocused = computed(() => focused.value !== -1)

    const isFocused = (index) => {
        return focused.value === index
    }

    const onInputFocus = (event) => {
        open()

        emit('focus', event)
    }

    const onInputBlur = (event) => {
        emit('blur', event)

        if (!_hasParent(event.relatedTarget || event.target, dropdown.value?.$el)) {
            if (!props.freeInput) {
                clearInputs()
            }

            resetFocus()

            close()
        }
    }

    const handleClickOutside = () => {
        if (!props.freeInput) {
            clearInputs()
        }

        resetFocus()
    }

    const _hasParent = (element, parent) => {
        let el = element?.parentElement

        if (!el) {
            return false
        }

        while (el) {
            if (!el) {
                break
            }

            if (el === parent) {
                return true
            }

            el = el.parentElement
        }

        return false
    }

    const updateQuery = (event) => {
        query.value = event.target.value

        handleSearchDebounced(event)

        if (props.freeInput) {
            selectValue(query?.value)
        }
    }

    // ================

    onMounted(() => {
        if (value.value === null && !props.withEmpty) {
            selectByIndex(0)
        }
    })

    // ================

    defineExpose({ open, close, toggle, focus })
</script>
