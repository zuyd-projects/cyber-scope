<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = ['name', 'key'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $appends = ['os', 'status'];

    public function getOsAttribute($value)
    {
        if ($this->ssh_requests()->count() > 0) {
            return 'Linux';
        } elseif ($this->packets()->count() > 0 || $this->win_firewall_logs()->count() > 0) {
            return 'Windows';
        } else {
            return 'Onbekend';
        }
    }

    public function getStatusAttribute()
    {
        // Get last packet, ssh_request, or win_firewall_log
        $lastPacket = $this->packets()->latest()->first();
        $lastSSHRequest = $this->ssh_requests()->latest()->first();
        $lastWinFirewallLog = $this->win_firewall_logs()->latest()->first();
        $lastActivity = null;
        if ($lastPacket) {
            $lastActivity = $lastPacket->created_at;
        }
        if ($lastSSHRequest && (!$lastActivity || $lastSSHRequest->created_at > $lastActivity)) {
            $lastActivity = $lastSSHRequest->created_at;
        }
        if ($lastWinFirewallLog && (!$lastActivity || $lastWinFirewallLog->created_at > $lastActivity)) {
            $lastActivity = $lastWinFirewallLog->created_at;
        }
        // dd($lastActivity);
        if ($lastActivity) {
            $diff = $lastActivity->diffInMinutes(now());
            if ($diff < 10) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public function packets()
    {
        return $this->hasMany(Packet::class);
    }

    public function ssh_requests()
    {
        return $this->hasMany(SSHRequest::class);
    }

    public function win_firewall_logs()
    {
        return $this->hasMany(WinFirewallLog::class);
    }
}
