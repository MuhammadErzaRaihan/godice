<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'GODICE — Virtual Dice Simulator')</title>

    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Laravel Vite Bundler -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body data-theme="arcade" class="min-h-screen text-white flex flex-col justify-between selection:bg-yellow-400 selection:text-black">

    <!-- Header Navigation Component -->
    <x-header />

    <!-- Main Content Stage -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 py-6">
        @yield('content')
    </main>

    <!-- Splash Screen Shake Overlay -->
    <x-splash-loading />

    <!-- Footer Component -->
    <x-footer />

    @stack('scripts')
</body>
</html>