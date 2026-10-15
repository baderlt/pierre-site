<?php

return [
    // Explicit IP/CIDR entries only. Never trust all proxies or forwarded hosts.
    'trusted_proxies' => array_values(array_filter(array_map('trim', explode(',', env('TRUSTED_PROXIES', ''))), function ($entry) {
        $parts = explode('/', $entry);
        $family = filter_var($parts[0], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) ? 32 : (filter_var($parts[0], FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) ? 128 : 0);
        return $family && count($parts) <= 2 && (! isset($parts[1]) || (ctype_digit($parts[1]) && (int) $parts[1] > 0 && (int) $parts[1] <= $family));
    })),
    'diagnostics' => (bool) env('INTEGRATION_DIAGNOSTICS', false),
    'country_codes' => explode(' ', 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'),
    'website_origin' => env('WEBSITE_ORIGIN', 'http://localhost:3000'),
    'proxy_secret' => env('QUOTATION_PROXY_SECRET'),
    'public_per_minute' => (int) env('PUBLIC_API_RATE_LIMIT', 120),
    'quotation_per_minute' => (int) env('QUOTATION_RATE_LIMIT', 5),
];
