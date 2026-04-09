import axios from 'axios';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config({ path: 'c:\\Users\\Torre\\Desktop\\TechAuraBot\\techaura_full_automatic-main\\.env' });

async function checkTikTokAuth() {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    console.log('--- TikTok Authorization Verification ---');
    console.log(`Client Key loaded: ${clientKey ? '✅ YES (' + clientKey + ')' : '❌ NO'}`);
    console.log(`Client Secret loaded: ${clientSecret ? '✅ YES' : '❌ NO'}`);

    if (!clientKey || !clientSecret) {
        console.error('❌ Missing credentials in .env');
        return;
    }

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

        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('Response:', response.data);
    } catch (error: any) {
        if (error.response) {
            console.log('API Response (Expected Error):');
            console.log('  Status:', error.response.status);
            console.log('  Data:', error.response.data);
            
            if (error.response.data.error === 'invalid_grant' || error.response.data.error_description?.includes('code')) {
                console.log('\n✅ Client credentials verified correctly. TikTok rejected the fake code but verified the client_key.');
            } else if (error.response.data.error === 'invalid_client' || error.response.data.error_description === 'client_key not exist') {
                 console.log('\n❌ CRITICAL: The TIKTOK_CLIENT_KEY is invalid or not registered in TikTok Developer portal.');
            } else {
                 console.log('\n⚠️ Unexpected response. Check error details.');
            }
        } else {
            console.error('Error connecting to TikTok API:', error.message);
        }
    }
}

checkTikTokAuth();
