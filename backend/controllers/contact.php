<?php
/**
 * ==============================================
 * Contact Form Handler
 * Handles form submissions from the portfolio
 * ==============================================
 */

// CORS headers for API requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load database configuration
require_once __DIR__ . '/../config/database.php';

// =============================================
// SANITIZE AND VALIDATE INPUT
// =============================================
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

$errors = [];

// Validate name
if (empty($name)) {
    $errors[] = 'Name is required';
} elseif (strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters';
}

// Validate email
if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address';
}

// Validate subject
if (empty($subject)) {
    $errors[] = 'Subject is required';
}

// Validate message
if (empty($message)) {
    $errors[] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
} elseif (strlen($message) > 5000) {
    $errors[] = 'Message must not exceed 5000 characters';
}

// If validation fails, return errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors) . '.'
    ]);
    exit();
}

// =============================================
// SANITIZE INPUTS
// =============================================
$name = htmlspecialchars(strip_tags($name), ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(strip_tags($phone), ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars(strip_tags($subject), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(strip_tags($message), ENT_QUOTES, 'UTF-8');

// =============================================
// HONEYPOT CHECK (Spam Protection)
// =============================================
$website = isset($_POST['website']) ? trim($_POST['website']) : '';
if (!empty($website)) {
    // Likely a bot
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you for your message!']);
    exit();
}

// =============================================
// RATE LIMITING (Simple IP-based)
// =============================================
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/contact_rate_' . md5($ip);
$rateLimitWindow = 300; // 5 minutes
$maxSubmissions = 3;

if (file_exists($rateLimitFile)) {
    $data = json_decode(file_get_contents($rateLimitFile), true);
    if ($data && $data['time'] > time() - $rateLimitWindow) {
        if ($data['count'] >= $maxSubmissions) {
            http_response_code(429);
            echo json_encode([
                'success' => false,
                'message' => 'Too many submissions. Please try again later.'
            ]);
            exit();
        }
        $data['count']++;
    } else {
        $data = ['time' => time(), 'count' => 1];
    }
} else {
    $data = ['time' => time(), 'count' => 1];
}
file_put_contents($rateLimitFile, json_encode($data));

// =============================================
// SAVE TO DATABASE (if available)
// =============================================
$dbSaved = false;
$pdo = getDBConnection();

if ($pdo !== null) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO contacts (name, email, phone, subject, message, ip_address, created_at)
            VALUES (:name, :email, :phone, :subject, :message, :ip, NOW())
        ");
        
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':subject' => $subject,
            ':message' => $message,
            ':ip' => $ip,
        ]);
        
        $dbSaved = true;
    } catch (PDOException $e) {
        error_log("Contact save error: " . $e->getMessage());
        // Continue with email sending even if DB fails
    }
}

// =============================================
// SEND EMAIL NOTIFICATION
// =============================================
$emailSent = false;
$to = 'hello@samolmurmu.com';
$emailSubject = "Portfolio Contact: {$subject} - From {$name}";

$emailBody = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
        <div style='background: linear-gradient(135deg, #0A2647, #8B0000); padding: 30px; text-align: center;'>
            <h1 style='color: #D4AF37; margin: 0; font-size: 24px;'>New Portfolio Inquiry</h1>
            <p style='color: #fff; margin: 10px 0 0;'>You have received a new message from your portfolio website.</p>
        </div>
        <div style='padding: 30px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 100px;'><strong>Name:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #333;'>" . htmlspecialchars($name) . "</td>
                </tr>
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #666;'><strong>Email:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #333;'><a href='mailto:" . htmlspecialchars($email) . "' style='color: #D4AF37;'>" . htmlspecialchars($email) . "</a></td>
                </tr>
                " . ($phone ? "<tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #666;'><strong>Phone:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #333;'>" . htmlspecialchars($phone) . "</td>
                </tr>" : "") . "
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #666;'><strong>Subject:</strong></td>
                    <td style='padding: 12px; border-bottom: 1px solid #eee; color: #333;'>" . htmlspecialchars($subject) . "</td>
                </tr>
            </table>
            <div style='margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;'>
                <h3 style='color: #333; margin: 0 0 10px;'>Message:</h3>
                <p style='color: #555; line-height: 1.6; margin: 0;'>" . nl2br(htmlspecialchars($message)) . "</p>
            </div>
        </div>
        <div style='background: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #eee;'>
            <p style='color: #999; font-size: 12px; margin: 0;'>This email was sent from the contact form on Samol Murmu's Portfolio</p>
        </div>
    </div>
</body>
</html>";

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=utf-8',
    'From: Samol Murmu Portfolio <noreply@samolmurmu.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
];

try {
    $emailSent = mail($to, $emailSubject, $emailBody, implode("\r\n", $headers));
} catch (Exception $e) {
    error_log("Email sending error: " . $e->getMessage());
}

// =============================================
// AUTO-RESPONSE TO THE SENDER
// =============================================
if ($emailSent) {
    $autoReplySubject = "Thank You for Contacting Samol Murmu";
    
    $autoReplyBody = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
            <div style='background: linear-gradient(135deg, #0A2647, #8B0000); padding: 30px; text-align: center;'>
                <h1 style='color: #D4AF37; margin: 0; font-size: 24px;'>Thank You!</h1>
            </div>
            <div style='padding: 30px;'>
                <p style='color: #333; font-size: 16px; line-height: 1.6;'>Dear <strong>" . htmlspecialchars($name) . "</strong>,</p>
                <p style='color: #555; font-size: 15px; line-height: 1.6;'>Thank you for reaching out! I have received your message regarding <strong>" . htmlspecialchars($subject) . "</strong> and will get back to you within 24-48 hours.</p>
                <p style='color: #555; font-size: 15px; line-height: 1.6;'>In the meantime, feel free to check out my portfolio or connect with me on social media.</p>
                <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
                    <p style='color: #999; font-size: 13px; margin: 0;'>Best regards,</p>
                    <p style='color: #333; font-size: 16px; font-weight: bold; margin: 5px 0 0;'>Samol Murmu</p>
                    <p style='color: #D4AF37; font-size: 14px; margin: 5px 0 0;'>AI Engineer | Full Stack Developer</p>
                </div>
            </div>
        </div>
    </body>
    </html>";
    
    $autoReplyHeaders = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: Samol Murmu <hello@samolmurmu.com>',
        'X-Mailer: PHP/' . phpversion(),
    ];
    
    @mail($email, $autoReplySubject, $autoReplyBody, implode("\r\n", $autoReplyHeaders));
}

// =============================================
// RETURN RESPONSE
// =============================================
$success = $dbSaved || $emailSent;

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been sent successfully. I will get back to you within 24-48 hours.'
]);