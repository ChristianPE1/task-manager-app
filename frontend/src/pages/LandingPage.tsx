export default function LandingPage() {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <main className="flex-1 space-y-6 text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                    Gestiona tus proyectos con <span className="text-indigo-600">Eficacia</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                    Organiza tus tareas, colabora con tu equipo y mantén el control de tus proyectos en un solo lugar. Simple, rápido y potente.
                </p>
                <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                    <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm">Laravel</span>
                    <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">React</span>
                    <span className="inline-block px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium text-sm">Tailwind CSS</span>
                </div>
            </main>
            <section className="flex-1 flex justify-center lg:justify-end">
                <div className="relative">
                    <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-20 animate-pulse"></div>
                    <img src="task-logo.webp" alt="Task Manager Logo" className="relative size-72 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"/>
                </div>
            </section>
        </div>
    )
}