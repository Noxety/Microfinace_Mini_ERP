import FloatingLines from '@/components/FloatingLines';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            {/* <div className="pointer-events-none fixed ">
                <FloatingLines
                    linesGradient={['#E945F5', '#2F4BC0', '#E945F5']}
                    animationSpeed={1}
                    interactive
                    bendRadius={5}
                    bendStrength={-0.5}
                    mouseDamping={0.05}
                    parallax
                    parallaxStrength={0.2}
                />
            </div> */}
            {/* Navigation */}
            <header className="mx-auto mb-8 w-full max-w-[335px] px-4 text-sm not-has-[nav]:hidden lg:max-w-7xl lg:px-8">
                <nav className="flex items-center justify-end gap-4 py-6">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] transition-colors hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] transition-colors hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                        >
                            Log in
                        </Link>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="mb-20 text-center">
                    <h1 className="mb-6 text-4xl leading-tight font-medium text-[#1b1b18] md:text-6xl lg:text-7xl dark:text-[#EDEDEC]">
                        Welcome to
                        <span className="block bg-gradient-to-r from-[#191400] to-[#4a4100] bg-clip-text text-transparent dark:from-[#EDEDEC] dark:to-[#A8A19F]">
                            Your App
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-[#4a4a47] md:text-2xl dark:text-[#A8A19F]">
                        Build amazing applications with speed and simplicity. Get started in minutes with our modern stack.
                    </p>
                    {!auth.user && (
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('login')}
                                className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-[#191400] to-[#4a4100] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-[#191400]/90 hover:to-[#4a4100]/90 hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features */}
                <section className="mb-24 grid gap-8 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#19140010] bg-white/10 bg-gradient-to-br p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-[#19140035] hover:shadow-lg dark:border-[#3E3E3A]/50 dark:bg-black/20 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 hover:dark:border-[#62605b]/50">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#191400] to-[#4a4100]">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Lightning Fast</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Built with modern React and Inertia.js for incredible performance and developer experience.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#19140010] bg-white/10 bg-gradient-to-br p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-[#19140035] hover:shadow-lg dark:border-[#3E3E3A]/50 dark:bg-black/20 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 hover:dark:border-[#62605b]/50">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#191400] to-[#4a4100]">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Simple Setup</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Get started immediately with our battle-tested authentication and scaffolding.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#19140010] bg-white/10 bg-gradient-to-br p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-[#19140035] hover:shadow-lg dark:border-[#3E3E3A]/50 dark:bg-black/20 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 hover:dark:border-[#62605b]/50">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#191400] to-[#4a4100]">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Beautiful Design</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Modern, accessible design system that looks great on every device and screen size.
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <div className="rounded-3xl bg-gradient-to-r from-[#f8f7f5]/50 to-[#f5f4f2]/50 py-20 text-center backdrop-blur-sm dark:from-[#2a2a28]/50 dark:to-[#252524]/50">
                        <h2 className="mb-6 text-3xl font-semibold text-[#1b1b18] md:text-4xl dark:text-[#EDEDEC]">Ready to get started?</h2>
                        <p className="mx-auto mb-10 max-w-md text-xl text-[#4a4a47] dark:text-[#A8A19F]">
                            Join thousands of developers building with our platform today.
                        </p>
                        <Link
                            href={route('login')}
                            className="inline-flex transform items-center rounded-2xl bg-gradient-to-r from-[#191400] to-[#4a4100] px-10 py-5 text-xl font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:from-[#191400]/90 hover:to-[#4a4100]/90 hover:shadow-2xl"
                        >
                            Log In Now
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
}
