import ColorBends from '@/components/ColorBends';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: { auth: { user: any } }) {
    return (
        <>
            <Head title="Unity Microfinance ERP">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div
                className="relative min-h-screen w-full overflow-hidden text-[13px]"
                style={{
                    fontFamily: '"Instrument Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
            >
                <div className="pointer-events-none fixed inset-0 z-10">
                    <div className="absolute inset-0">
                        <ColorBends
                            rotation={190}
                            speed={0.5}
                            colors={['#0aff68', '#62f4dc', '#66ffa1']}
                            transparent
                            autoRotate={0}
                            scale={1}
                            frequency={1}
                            warpStrength={1}
                            mouseInfluence={1}
                            parallax={0.5}
                            noise={0.1}
                            className="absolute inset-0"
                        />
                    </div>
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80 dark:from-black/60 dark:via-black/40 dark:to-black/70" /> */}
                </div>

                <div className="relative z-10 bg-transparent">
                    <header className="mx-auto mb-8 w-full max-w-[335px] px-4 pt-4 text-sm lg:max-w-7xl lg:px-8">
                        <nav className="flex items-center justify-between gap-4 py-4">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/90 text-white shadow-sm dark:bg-white/90 dark:text-black">
                                    <span className="text-xs font-semibold tracking-tight">U</span>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-xs font-semibold tracking-[0.18em] text-neutral-700 uppercase dark:text-neutral-200">
                                        Unity Microfinance Ltd
                                    </span>
                                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Enterprise ERP · Progressive Web App</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center rounded-sm border border-[#19140035] bg-white/70 px-4 py-1.5 text-xs font-medium text-[#1b1b18] backdrop-blur-sm transition hover:border-[#1915014a] hover:bg-white dark:border-[#3E3E3A] dark:bg-[#141412e6] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-sm border border-transparent bg-white/70 px-4 py-1.5 text-xs font-medium text-[#1b1b18] backdrop-blur-sm transition hover:border-[#19140035] hover:bg-white dark:bg-[#141412e6] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        login
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </header>
                    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[335px] flex-col px-4 pb-10 lg:max-w-7xl lg:flex-row lg:items-center lg:gap-16 lg:px-8">
                        <section className="flex-1 space-y-5 pt-4 pb-10 lg:pt-0">
                            <span className="inline-flex items-center rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-neutral-600 uppercase shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/10 dark:text-neutral-200">
                                Unity Microfinance ERP · PWA
                            </span>

                            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl dark:text-neutral-50">
                                Welcome to your unified microfinance operations workspace.
                            </h1>

                            <p className="max-w-xl text-[13px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                                Unity ERP connects branches, loan officers, and head office in one secure browser‑based system. Access loans, savings,
                                groups, accounting, and reports from any device with a single sign‑on.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center rounded-md border border-neutral-900/20 bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-black dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center rounded-md border border-neutral-900/20 bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-black dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                                    >
                                        Proceed to secure login
                                    </Link>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4 pt-3 text-[11px] text-neutral-600 dark:text-neutral-400">
                                <div>
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Branch &amp; field‑ready</span> optimized
                                    for loan officers, cashiers, and managers.
                                </div>
                            </div>
                        </section>
                        <section className="flex-1 pb-10 lg:pb-0">
                            <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#050507]/92">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black">
                                            <span className="text-[11px] font-semibold">U</span>
                                        </div>
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-50">
                                                Unity Microfinance Ltd
                                            </span>
                                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Staff access portal</span>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                                        Secure · SSL
                                    </span>
                                </div>

                                <p className="mb-3 text-[11px] text-neutral-600 dark:text-neutral-300">
                                    Continue to the login screen with your Unity credentials. Access is restricted to authorized Unity Microfinance
                                    staff.
                                </p>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="mb-3 inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black dark:bg-white dark:text-black"
                                    >
                                        Go to dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="mb-3 inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black dark:bg-white dark:text-black"
                                    >
                                        Go to login
                                    </Link>
                                )}

                                <div className="space-y-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                                    <div>Branch staff · Head office · Internal audit · IT admin.</div>
                                    <div>Having trouble? Contact IT support or your branch administrator before attempting to log in again.</div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
