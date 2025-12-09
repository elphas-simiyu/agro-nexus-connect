# AI Chatbot & Weather Integration Guide

## Overview

The Agro Nexus Connect application now includes an intelligent AI chatbot and real-time weather integration to guide farmers and buyers through agricultural transactions and decision-making.

## Features

### 🤖 AI Chatbot Features

- **Context-Aware Responses**: Tailored guidance for farmers and buyers
- **Multi-turn Conversations**: Natural conversation flow with history retention
- **Quick Suggestions**: One-click suggestions based on user type
- **Smart Tips**: Farming and buying tips displayed within the chat
- **Real-time Integration**: Connects with live weather data
- **Fallback Support**: Works without internet with built-in responses

### 🌦️ Weather Integration

- **Real-time Weather Data**: Current conditions and 5-day forecast
- **Geolocation Support**: Auto-detect user location
- **Agricultural Recommendations**: Weather-based farming advice
- **Location-Based Search**: Find weather for any location
- **Mobile Friendly**: Responsive design for all devices

## Setup Instructions

### 1. Frontend Configuration

#### Get Weather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

#### Update Frontend Environment

Create/update `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
```

### 2. Backend Configuration

#### Get AI API Key (Choose One)

**Option A: Groq API (Recommended - Free)**
- Visit [Groq Console](https://console.groq.com)
- Sign up for free account
- Generate API key
- Free tier includes 30 API calls per minute

**Option B: OpenAI API**
- Visit [OpenAI API](https://platform.openai.com)
- Requires payment (starting at $5)
- More powerful models available

**Option C: Local Ollama (Self-Hosted)**
- Download from [Ollama](https://ollama.ai)
- Run `ollama run mistral` (or other model)
- No API key needed
- Run locally at http://localhost:11434

#### Update Backend Environment

Create/update `backend/.env`:

```env
DATABASE_URL=postgres://agronexus:password@localhost:5432/agronexus_db
NODE_ENV=development
PORT=4000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Choose one of these:
GROQ_API_KEY=your_groq_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
# OR
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Install Dependencies

The chatbot requires additional packages:

```bash
# Frontend
cd /workspaces/agro-nexus-connect
npm install

# Backend
cd backend
npm install axios
```

## Usage

### For Farmers

The chatbot appears as a floating button on the Dashboard page.

**Accessible Features:**
- Crop growing advice
- Pest and disease management
- Soil preparation tips
- Market insights
- Weather-based recommendations
- Irrigation scheduling

**Example Questions:**
- "How do I treat tomato leaf disease?"
- "What's the best time to plant maize?"
- "How can I improve my soil quality?"
- "What crops are trending in the market?"

### For Buyers

The chatbot appears as a floating button on the Marketplace page.

**Accessible Features:**
- Quality assessment tips
- Produce sourcing guidance
- Fair pricing information
- Seasonal availability
- Direct farmer connections
- Storage and handling advice

**Example Questions:**
- "How do I identify fresh vegetables?"
- "What's the fair price for tomatoes?"
- "How do I store produce properly?"
- "Where can I find farmers near me?"

## API Endpoints

### Chatbot Endpoints

#### Send Message
```
POST /api/chat
Content-Type: application/json

{
  "message": "How do I prevent tomato leaf diseases?",
  "context": {
    "userType": "farmer",
    "location": "Nairobi, Kenya",
    "weather": {
      "temperature": 25,
      "condition": "Partly Cloudy",
      "humidity": 65
    }
  },
  "history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response:**
```json
{
  "message": "To prevent tomato leaf disease...",
  "suggestions": [
    "Show organic methods",
    "Fungicide options",
    "Prevention tips"
  ],
  "timestamp": "2024-12-08T10:30:00Z"
}
```

#### Get Farming Tips
```
GET /api/chat/tips/farming

Response:
{
  "tips": [
    "🌱 Crop Rotation: Alternate crops to maintain soil health",
    "💧 Irrigation: Water early morning or evening..."
  ]
}
```

#### Get Buying Tips
```
GET /api/chat/tips/buying

Response:
{
  "tips": [
    "👃 Smell Test: Fresh produce has a strong, natural aroma",
    "🔍 Visual Inspection: Look for vibrant colors..."
  ]
}
```

#### Clear Chat History
```
DELETE /api/chat/history

Response:
{
  "message": "Chat history cleared"
}
```

## Weather API Usage

### Frontend Service

```typescript
import weatherService from '@/services/weather';

// Get weather by coordinates
const weather = await weatherService.getWeatherByCoords(
  latitude: -1.286389,  // Nairobi
  longitude: 36.817223
);

// Get weather by city
const weather = await weatherService.getWeatherByCity('Nairobi');

// Get 5-day forecast
const forecast = await weatherService.getForecast(latitude, longitude);

// Get user's current location
const location = await weatherService.getCurrentLocation();

// Get agricultural recommendations
const tips = weatherService.getAgricultureRecommendations(weather);
```

### Weather Data Structure

```typescript
interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  icon: string;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  precipitation: number;
  humidity: number;
}
```

## Chatbot Customization

### Modify System Prompts

Edit `backend/src/controllers/chatbotController.js`:

```javascript
const SYSTEM_PROMPTS = {
  farmer: `Your custom farmer prompt...`,
  buyer: `Your custom buyer prompt...`,
  guest: `Your custom guest prompt...`,
};
```

### Add Custom Suggestions

Edit `backend/src/controllers/chatbotController.js`:

```javascript
function generateSuggestions(message, context) {
  const suggestions = [];
  
  if (context.userType === "farmer") {
    // Add farmer-specific suggestions
  }
  
  return suggestions;
}
```

### Modify Chat UI

Edit `src/components/Chatbot.tsx`:

- Change colors: Modify gradient classes
- Change position: Modify `fixed` positioning
- Add features: Add new chat modes or functions

## Troubleshooting

### Weather API Not Working

**Error: "Weather API error"**
- Verify API key is correct
- Check OpenWeatherMap status page
- Ensure location format is correct
- Try using coordinates instead of city name

**Solution:**
```javascript
// Use coordinates directly
const weather = await weatherService.getWeatherByCoords(-1.286, 36.817);
```

### Chatbot Not Responding

**Error: "No response from chatbot"**
- Check GROQ_API_KEY in backend/.env
- Verify API key has available quota
- Check internet connection
- Fallback to mock responses enabled

**Test API:**
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "context": {"userType": "farmer"}}'
```

### CORS Issues

**Error: "CORS policy: Cross-Origin Request Blocked"**
- CORS is enabled in backend
- Verify VITE_API_BASE_URL matches backend port
- Check browser console for exact error

**Solution:**
```env
# .env
VITE_API_BASE_URL=http://localhost:4000
```

### Geolocation Permission

**Error: "Geolocation not supported"**
- User denied location permission
- Browser doesn't support geolocation
- Using HTTP instead of HTTPS

**Solution:**
- Ask user to enable location in settings
- Fall back to city-based search
- Use manual location input

## Performance Tips

### Caching

The frontend uses React Query for caching:
- Weather data cached for 10 minutes
- Chat history stored in browser
- Automatic refetch on network reconnect

### Rate Limiting

- Groq API: 30 requests/minute (free tier)
- OpenWeatherMap: 60 calls/minute (free tier)
- Consider caching responses

### Optimization

```typescript
// Cache weather for specific location
const { data: weather } = useQuery({
  queryKey: ["weather", location],
  queryFn: () => weatherService.getWeatherByCity(location),
  staleTime: 10 * 60 * 1000, // 10 minutes
  cacheTime: 60 * 60 * 1000,  // 1 hour
});
```

## Privacy & Security

### Data Handling

- Chat history stored locally (browser storage)
- Location data only sent when requested
- API keys never exposed to frontend
- All API calls go through backend

### Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for secrets
3. **Rotate API keys** periodically
4. **Monitor API usage** for anomalies
5. **Set rate limits** on backend

## Future Enhancements

- [ ] Multi-language support
- [ ] Chat history persistence (database)
- [ ] Advanced weather analytics
- [ ] AI model fine-tuning for agriculture
- [ ] Voice input/output
- [ ] Image analysis for pest detection
- [ ] Integration with farming IoT devices
- [ ] Yield prediction models

## Support & Resources

### API Documentation
- [Groq API Docs](https://console.groq.com/docs)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [OpenAI API](https://platform.openai.com/docs)

### Community
- [Agro Nexus Connect GitHub](https://github.com/elphas-simiyu/agro-nexus-connect)
- Report issues and feature requests

## Quick Commands

```bash
# Test chatbot endpoint
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","context":{"userType":"farmer"}}'

# Get farming tips
curl http://localhost:4000/api/chat/tips/farming

# Get buying tips
curl http://localhost:4000/api/chat/tips/buying

# Test weather API
curl "https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=YOUR_API_KEY&units=metric"
```

---

**Last Updated:** December 8, 2024
**Version:** 1.0
