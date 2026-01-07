import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import apiService from '../services/api';
import { ChatMessage, ChatResponse } from '../types';

interface AIChatProps {
  orchardId?: number;
}

const AIChat: React.FC<AIChatProps> = ({ orchardId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response: ChatResponse = await apiService.chatWithAI(
        inputMessage,
        orchardId,
        selectedImage || undefined
      );

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setSelectedImage(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          AI Orchard Assistant
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ask questions about your orchard, upload images for analysis, or get recommendations.
        </Typography>
        {orchardId && (
          <Chip 
            label={`Orchard Context: ${orchardId}`} 
            size="small" 
            color="primary" 
            sx={{ mt: 1 }}
          />
        )}
      </Paper>

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <AIIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Welcome to your AI Orchard Assistant!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ask me anything about your orchard health, disease detection, or management recommendations.
              </Typography>
            </Box>
          ) : (
            <List>
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '70%',
                      flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {message.role === 'user' ? <PersonIcon /> : <AIIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <Card
                      sx={{
                        bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <CardContent sx={{ py: 1, px: 2 }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </ListItem>
              ))}
              {isLoading && (
                <ListItem sx={{ justifyContent: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="textSecondary">
                      AI is thinking...
                    </Typography>
                  </Box>
                </ListItem>
              )}
            </List>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="chat-image-upload"
            type="file"
            onChange={handleImageSelect}
          />
          <label htmlFor="chat-image-upload">
            <IconButton component="span" color="primary">
              <AttachFileIcon />
            </IconButton>
          </label>
          
          {selectedImage && (
            <Chip
              label={selectedImage.name}
              onDelete={() => setSelectedImage(null)}
              icon={<ImageIcon />}
              color="primary"
              variant="outlined"
            />
          )}
          
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your orchard health, upload images for analysis..."
            disabled={isLoading}
            sx={{ flex: 1 }}
          />
          
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIChat; 