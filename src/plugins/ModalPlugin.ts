import { markRaw, reactive, resolveComponent } from "vue"
import type { Component } from "vue"
import type { AnyObject } from "@/types"

export const modals = reactive(new Map<ModalKey, Modal>())

export type ModalKey = any

export type ModalOptions = {
    key?: string,
    group?: string,
    position?: 'top' | 'center' | 'left' | 'right' | 'context-menu' | 'free',
    place?: string,
    onExists?: (key: ModalKey, modal: Modal) => boolean,
    onClose?: false | ((...rejectPayload: any[]) => boolean | any),
    promise?: boolean,
    closeOnOverlay?: boolean,
}

export type ModalComputedOptions = {
    resolve?: (value?: any) => void,
    reject?: (value?: any) => void,
}

export type ModalPayload = AnyObject

export type Modal = {
    component: string | Component,
    options: ModalOptions,
    payload: ModalPayload,
}

export const showModal = async (
    component: string | Component,
    options: ModalOptions = {},
    payload: ModalPayload = {},
): Promise<any> => {
    component = (typeof component === 'string' ? component : markRaw(component))

    const resolvedComponent = typeof component === 'string' ? resolveComponent(component) : component

    if (typeof resolvedComponent === 'object' && typeof resolvedComponent.modal === 'object') {
        options = Object.assign(resolvedComponent.modal, options)
    }

    const _options: ModalOptions & ModalComputedOptions = options

    const key = _options.key || component

    if (!_options.place) {
        _options.place = null
    }

    if (modals.has(key)) {
        if (_options.onExists && typeof _options.onExists === 'function') {
            const modal = modals.get(key)

            if (!_options.onExists(key, modal)) {
                return
            }
        } else {
            return
        }
    }

    let promise

    if (_options.promise) {
        promise = new Promise((resolve, reject) => {
            let handled = false

            _options.resolve = (...args) => {
                if (handled) {
                    return
                }

                handled = true

                resolve(...args)
            }

            _options.reject = (...args) => {
                if (handled) {
                    return
                }

                handled = true

                reject(...args)
            }
        })
    }

    console.log('Open modal:', _options, payload)

    modals.set(key, {
        component,
        options,
        payload,
    })

    if (promise !== undefined) {
        return promise
    }
}

export const hideModal = (key: ModalKey | { group?: string } | { place?: string }) => {
    console.log('Hide modal:', key)

    const isComponent = key.render || key.setup || key.__name

    if (typeof key !== 'object' || isComponent) {
        modals.delete(key)
        return
    }

    const options = key

    let collection = [...modals.entries()]

    if (options.place) {
        collection = collection.filter(([k, value]) => (!value.options.place || value.options.place === options.place))
    } else {
        key = options.key
        const group = options.group

        if (group) {
            collection = collection.filter(([k, value]) => (value.options.group && value.options.group === group && (!key || k === key)))
        }
    }

    collection.map(([k]) => k).forEach(k => modals.delete(k))
}

export const findModal = (key: ModalKey) => {
    return modals.get(key)
}

export default {
    install(app) {
        // Options API
        app.config.globalProperties.$modals = modals
        app.config.globalProperties.$showModal = showModal
        app.config.globalProperties.$hideModal = hideModal
        app.config.globalProperties.$findModal = findModal

        // Composition API
        app.provide('$modals', modals)
        app.provide('$showModal', showModal)
        app.provide('$hideModal', hideModal)
        app.provide('$findModal', findModal)
    },
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $modals: typeof modals,
        $showModal: typeof showModal,
        $hideModal: typeof hideModal,
        $findModal: typeof findModal,
    }

    interface ComponentCustomOptions {
        modal?: ModalOptions,
    }
}