const crypto = require('crypto');

async function checkTikTokAuth() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY || '[REDACTED_KEY]';
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || '[REDACTED_SECRET]';

    console.log('--- TikTok Authorization Verification ---');
    console.log(`Client Key loaded: ${clientKey ? '✅ YES (' + clientKey + ')' : '❌ NO'}`);
    console.log(`Client Secret loaded: ${clientSecret ? '✅ YES' : '❌ NO'}`);

    const redirectUri = encodeURIComponent(`https://techauraz.com/api/tiktok/callback`);
    const scopes = 'user.info.basic,video.publish,video.upload';
    const state = 'techaura2026_test';
    
    // Create PKCE verifier
    const CODE_VERIFIER = 'techaura2026_tiktok_oauth_code_verifier_string_12345_67890_abc';
    const codeChallenge = crypto.createHash('sha256').update(CODE_VERIFIER).digest('hex');

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    console.log(`\n➡️  Action Required: User must authorize the application by visiting this URL:\n${authUrl}\n`);
    
    try {
        const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
        const params = new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            code: 'invalid_code_for_dry_run_test',
            grant_type: 'authorization_code',
            redirect_uri: 'https://techauraz.com/api/tiktok/callback'
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            body: params.toString()
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.log('API Response (Expected Error):');
            console.log('  Status:', response.status);
            console.log('  Data:', data);
            
            if (data.error === 'invalid_grant' || data.error_description?.includes('code')) {
                console.log('\n✅ Client credentials verified correctly. TikTok rejected the fake code but verified the client_key.');
            } else if (data.error === 'invalid_client' || data.error_description === 'client_key not exist') {
                 console.log('\n❌ CRITICAL: The TIKTOK_CLIENT_KEY is invalid or not registered in TikTok Developer portal.');
            } else {
                 console.log('\n⚠️ Unexpected response. Check error details.');
            }
        } else {
             console.log('Response:', data);
        }

    } catch (error) {
        console.error('Error connecting to TikTok API:', error.message);
    }
}

checkTikTokAuth();
