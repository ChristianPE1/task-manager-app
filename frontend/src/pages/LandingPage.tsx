export default function LandingPage() {
    return (
        <div className="max-w-7xl flex flex-row-reverse justify-center items-center h-screen mx-auto">
            <section>
                <img src="task-logo.webp" alt="Task Manager Logo" className="size-72 "/>
            </section>
            <main>
                <h1 className="text-4xl text-green-400 font-bold mb-4">Bienvenido a Task Manager</h1>
                <p className="text-lg text-gray-700">Esta aplicación es un gestor de tareas y proyectos.</p>
                <p>Está desarrollado con Laravel y React.</p>
            </main>
        </div>
    )
}