<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:cleanup-data')
    ->dailyAt('00:00');
