import type { Component } from "vue"
import type { ModalPayload } from "@/plugins/ModalPlugin"
import type { ModalOptions } from "@/plugins/ModalPlugin"
import { MessageType } from "@/types/enums/MessageType"
import ModalConfirm from "@/components/Modal/Confirm/ModalConfirm.vue"
import { showModal } from "@/plugins/ModalPlugin"

export type ConfirmModalFunction = (
    payload?: string | {
        type?: MessageType,
        text?: string,
        description?: string,
        confirmButton?: boolean | string,
        cancelButton?: boolean | string,
    } & ModalPayload,
    config?: {
        component?: string | Component,
    } & ModalOptions,
) => Promise<boolean>

export const $confirm: ConfirmModalFunction = async function (
    payload = {},
    config = {},
) {
    const component = config.component ?? ModalConfirm
    const group = config.group ?? 'confirm'

    if (typeof payload === 'string') {
        payload = {
            text: payload,
        }

        if (payload.text.includes('delete') || payload.text.includes('remove')) {
            payload.type = MessageType.Danger
        }
    }

    return await showModal(
        component,
        Object.assign({
            position: 'center',
            promise: true,
            group,
        }, config),
        payload,
    )
}

export default {
    install(app) {
        // Options API
        app.config.globalProperties.$confirm = $confirm

        // Composition API
        app.provide('$confirm', $confirm)
    },
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $confirm: typeof $confirm,
    }
}