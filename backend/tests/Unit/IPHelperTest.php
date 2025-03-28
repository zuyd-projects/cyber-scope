<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class IPHelperTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_ip_is_normalized(): void
    {
        $ip = "10.168.116.112";
        $result = \App\Helpers\IPHelper::normalizeIP($ip);

        $this->assertEquals(ip2long($ip), $result);

        $result2 = \App\Helpers\IPHelper::normalizeIP($result);
        $this->assertEquals($result, $result2);
    }
}
