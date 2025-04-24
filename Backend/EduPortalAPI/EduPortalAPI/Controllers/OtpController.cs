using EduPortalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

[ApiController]
[Route("api/[controller]")]
public class OtpController : ControllerBase
{
    private static readonly Dictionary<string, string> OtpStore = new();

    [HttpPost("send")]
    public async Task<IActionResult> SendOtp([FromBody] OtpRequest request)
    {
        var otp = new Random().Next(100000, 999999).ToString();
        OtpStore[request.PhoneNumber] = otp;

        var client = new HttpClient();
        var url = $"https://www.fast2sms.com/dev/bulkV2" +
                  $"?authorization=EWcIeLB6HUOGDTgrjy8vYfk0A2n9oqlhX5VPaK1Rw3iQMzsN4CuBHRe8SyAtdp0Z5OfixaN2MQoTG6vl" +
                  $"&route=otp" +
                  $"&variables_values={otp}" +
                  $"&flash=0" +
                  $"&numbers={request.PhoneNumber}";

        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await client.GetAsync(url);

        return Ok(new { message = "OTP sent", otp }); // ⚠️ Remove `otp` in production
    }

    [HttpPost("verify")]
    public IActionResult VerifyOtp([FromBody] OtpVerify model)
    {
        if (OtpStore.ContainsKey(model.PhoneNumber) && OtpStore[model.PhoneNumber] == model.Otp)
        {
            OtpStore.Remove(model.PhoneNumber);
            return Ok(new { success = true, message = "OTP verified" });
        }

        return Unauthorized(new { success = false, message = "Invalid OTP" });
    }
}
