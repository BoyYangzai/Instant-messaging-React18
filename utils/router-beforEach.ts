import { NextRouter, useRouter } from "next/router"

export function routerBeforEach(router: NextRouter) {
    if (!localStorage.getItem('token')) {
        router.push('/')
    }
} 