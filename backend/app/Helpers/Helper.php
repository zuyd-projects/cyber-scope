<?php

namespace App\Helpers;

use App\Models\User;


class Helper
{
    public static function getUserIdsByDevice($device): array
    {
        $userIds = [];

        foreach ($device->users as $user) {
            $userIds[] = $user->id;
        }
        foreach (User::admins() as $user) {
            $userIds[] = $user->id;
        }

        return $userIds;
    }
}
