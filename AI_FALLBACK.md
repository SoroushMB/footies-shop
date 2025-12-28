# AI Fallback System Documentation

## Overview

The Footies-Shop backend implements an intelligent AI fallback system that automatically switches between Google Gemini and OpenRouter when quota limits are reached. This ensures uninterrupted AI service without any customer-facing errors.

## Architecture

### Primary Provider: Google Gemini 2.0 Flash
- **Model**: `gemini-2.0-flash-exp`
- **Use Cases**: Product suggestions, customer support chat
- **Advantages**: Fast, efficient, free tier available

### Fallback Provider: OpenRouter
- **Default Model**: `openrouter/auto` (automatically selects best free model)
- **Use Cases**: Same as Gemini (seamless replacement)
- **Advantages**: Access to multiple free LLMs, automatic model selection

## How It Works

### 1. Request Flow

```
User Request
    ↓
Backend AI Service
    ↓
Try Gemini First
    ↓
Success? → Return Response
    ↓
Error? → Check Error Type
    ↓
Quota Error? → Fallback to OpenRouter
    ↓
Other Error? → Try OpenRouter (if configured)
    ↓
Return Response or Error
```

### 2. Error Detection

The system detects quota errors by checking:
- Error codes: `RESOURCE_EXHAUSTED`, `429`, `quota`, `rate_limit`
- HTTP status codes: `429` (Too Many Requests)
- Error messages containing quota-related keywords

### 3. Automatic Switching

When a quota error is detected:
1. Log the error for monitoring
2. Automatically switch to OpenRouter
3. Use the same prompt/context
4. Return response seamlessly
5. No customer-facing error messages

## Configuration

### Environment Variables

**Backend (.env):**
```env
# Primary AI Provider
GOOGLE_API_KEY=AIzaxxxxx

# Fallback AI Provider
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_DEFAULT_MODEL=openrouter/auto  # Optional
```

### Model Selection

- **`openrouter/auto`** (default): Automatically selects the best free model
- **Custom model**: Set `OPENROUTER_DEFAULT_MODEL` to a specific model ID
  - Examples: `meta-llama/llama-3.2-3b-instruct:free`, `google/gemini-2.0-flash-exp:free`

## Implementation Details

### Error Handling

```typescript
function isQuotaError(error: unknown): boolean {
  // Checks multiple error indicators:
  // - Error codes
  // - HTTP status codes
  // - Error messages
}
```

### Fallback Logic

```typescript
try {
  // Try Gemini
  return await useGemini(prompt);
} catch (error) {
  if (isQuotaError(error) && openRouter) {
    // Automatic fallback
    return await useOpenRouter(prompt);
  }
  // Handle other errors
}
```

## Benefits

1. **Zero Downtime**: AI features continue working even when Gemini quota is exhausted
2. **Cost Effective**: Uses free OpenRouter models as fallback
3. **Transparent**: Customers never see errors or service interruptions
4. **Flexible**: Can use either provider independently or together
5. **Monitoring**: All fallback events are logged for analysis

## Monitoring

Check backend logs for:
- `"Gemini quota exhausted, falling back to OpenRouter..."` - Quota error detected
- `"Gemini failed, falling back to OpenRouter..."` - Other error, using fallback
- `"OpenRouter API error:"` - Both providers failed

## Best Practices

1. **Always configure both providers** for maximum reliability
2. **Monitor logs** to track fallback frequency
3. **Set up alerts** for repeated fallback events (may indicate quota issues)
4. **Test fallback** by temporarily disabling Gemini API key
5. **Use free models** on OpenRouter to minimize costs

## Free Tier Limits

| Provider | Free Tier |
|----------|-----------|
| Google Gemini | 60 requests/minute |
| OpenRouter | Free models available, pay-per-use for premium |

## Troubleshooting

### Fallback not working
- Check `OPENROUTER_API_KEY` is set correctly
- Verify OpenRouter account is active
- Check backend logs for specific error messages

### Both providers failing
- Verify API keys are valid
- Check network connectivity
- Review rate limits on both services

### Unexpected fallbacks
- Monitor Gemini quota usage
- Check for rate limiting issues
- Consider upgrading Google AI quota

