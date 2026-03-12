import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

import Home from "@/views/Home.vue";
import Products from "@/views/Products.vue";
import Support from "@/views/Support.vue";

const routes: Array<RouteRecordRaw>=[
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/products',
        name: 'Products',
        component: Products
    },
    {
        path: '/support',
        name: 'Support',
        component: Support
    }
]

const router=createRouter({
    history: createWebHashHistory(),
    routes
});

export default router