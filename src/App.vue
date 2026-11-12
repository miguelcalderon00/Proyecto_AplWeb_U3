<template>
    <div class="app">
        <header class="header">
            <div class="container header-content">
                <h1>TaskFlow</h1>

                <nav>
                    <RouterLink to="/">Inicio</RouterLink>
                    <RouterLink to="/tareas">Mis tareas</RouterLink>
                </nav>
            </div>
        </header>

        <RouterView />
    </div>
</template>
