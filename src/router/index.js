import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from "@/components/HelloWorld";
import Login from "@/views/Login";
import NotFound from "@/views/NotFound";
import Register from "@/views/Register";
import Home from "@/views/Home";
import Workspace from "@/components/Workspace";
import Resource from "@/components/Resource";
import Settings from "@/components/Settings";
import Editproj from "@/components/Editproj";
import Createproj from "@/components/Createproj";
import Listproj from "@/components/Listproj";
import Test from "@/components/Test";
import Listtask from "@/components/Listtask";
import Mytask from "@/components/Mytask";
import Editvideoproj from "@/components/Editvideoproj";

Vue.use(Router);

const routes = [
    {
        path: '/login',
        exact: true,
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        redirect: Login
    },
    {
        path: '*',
        component: NotFound
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/home/:id//',
        name: 'Home',
        component: Home,
        children: [
            {
                path: 'workspace',
                name: 'Workspace',
                component: Workspace
            },
            {
                path: 'resource',
                name: 'Resource',
                component: Resource
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings
            },
            {
                path: 'editproj',
                name: 'Editproj',
                component: Editproj
            },
            {
                path: 'createproj',
                name: 'Createproj',
                component: Createproj
            },
            {
                path: 'listproj',
                name: 'Listproj',
                component: Listproj
            },
            {
                path: 'test',
                name: 'Test',
                component: Test
            },
            {
                path: 'listtask',
                name: 'Listtask',
                component: Listtask
            },
            {
                path: 'mytask',
                name: 'Mytask',
                component: Mytask
            },
            {
                path: 'editvideoproj',
                name: 'Editvideoproj',
                component: Editvideoproj
            }
        ]
    }

]

const router = new Router({
    mode: "history",
    routes
})

export default router