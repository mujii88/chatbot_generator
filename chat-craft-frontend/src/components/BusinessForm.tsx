/**
 * Business information form for creating chatbots
 */
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import LoadingSpinner from './LoadingSpinner'
import FileUpload from './FileUpload'
import { validateBusinessForm, parseFaqText } from '@/utils/validators'
import type { BusinessInfo, CreateChatbotRequest } from '@/types'
import { cn } from '@/lib/utils'

interface BusinessFormProps {
  onSubmit: (data: CreateChatbotRequest) => void
  isLoading?: boolean
  error?: string | null
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error 
}) => {
  const [faqText, setFaqText] = useState('')
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([])
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors }
  } = useForm<BusinessInfo>({
    defaultValues: {
      tone: 'friendly'
    }
  })
  
  const watchedValues = watch()
  
  const handleFormSubmit = (data: BusinessInfo) => {
    // Parse FAQs from text
    const faqs = parseFaqText(faqText)
    
    // Validate form data
    const validationErrors = validateBusinessForm({ ...data, faqs })
    
    if (Object.keys(validationErrors).length > 0) {
      setLocalErrors(validationErrors)
      return
    }
    
    setLocalErrors({})
    
    // Submit the form
    onSubmit({
      name: data.name,
      description: data.description,
      website_url: data.website_url,
      tone: data.tone,
      faqs: faqs,
      knowledge_files: knowledgeFiles
    })
  }
  
  const getError = (field: string) => {
    return formErrors[field as keyof BusinessInfo]?.message || localErrors[field]
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Create Your Chatbot
        </CardTitle>
        <CardDescription className="text-base">
          Fill in your business information to generate an AI-powered chatbot for your website
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Business Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter your business name"
              {...register('name', { 
                required: 'Business name is required',
                maxLength: { value: 80, message: 'Name must be 80 characters or less' }
              })}
              className={cn(
                'transition-smooth',
                getError('name') ? 'border-destructive focus:ring-destructive' : ''
              )}
            />
            {getError('name') && (
              <p className="text-sm text-destructive">{getError('name')}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Business Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your business, products, services, and any important details customers should know..."
              rows={4}
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 300, message: 'Description must be 300 characters or less' }
              })}
              className={cn(
                'transition-smooth resize-none',
                getError('description') ? 'border-destructive focus:ring-destructive' : ''
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{getError('description') && <span className="text-destructive">{getError('description')}</span>}</span>
              <span>{watchedValues.description?.length || 0}/300</span>
            </div>
          </div>
          
          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="text-sm font-medium">
              Website URL (Optional)
            </Label>
            <Input
              id="website_url"
              type="url"
              placeholder="https://yourbusiness.com"
              {...register('website_url')}
              className={cn(
                'transition-smooth',
                getError('website_url') ? 'border-destructive focus:ring-destructive' : ''
              )}
            />
            {getError('website_url') && (
              <p className="text-sm text-destructive">{getError('website_url')}</p>
            )}
          </div>
          
          {/* Tone Selection */}
          <div className="space-y-2 mb-8">
            <Label htmlFor="tone" className="text-sm font-medium">
              Chatbot Tone *
            </Label>
            <Select
              onValueChange={(value) => setValue('tone', value as 'friendly' | 'professional' | 'casual')}
              defaultValue="friendly"
            >
              <SelectTrigger className={cn(
                'transition-smooth',
                getError('tone') ? 'border-destructive focus:ring-destructive' : ''
              )}>
                <SelectValue placeholder="Select chatbot tone" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-border shadow-lg z-50">
                <SelectItem value="friendly" className="bg-white hover:bg-muted cursor-pointer">
                  Friendly - Warm and welcoming
                </SelectItem>
                <SelectItem value="professional" className="bg-white hover:bg-muted cursor-pointer">
                  Professional - Formal and business-like
                </SelectItem>
                <SelectItem value="casual" className="bg-white hover:bg-muted cursor-pointer">
                  Casual - Relaxed and conversational
                </SelectItem>
              </SelectContent>
            </Select>
            {getError('tone') && (
              <p className="text-sm text-destructive">{getError('tone')}</p>
            )}
          </div>
          
          {/* FAQs */}
          <div className="space-y-2">
            <Label htmlFor="faqs" className="text-sm font-medium">
              Frequently Asked Questions *
            </Label>
            <Textarea
              id="faqs"
              placeholder="Enter your FAQs in this format:
Q: What are your business hours?
A: We're open Monday to Friday, 9 AM to 6 PM.

Q: Do you offer shipping?
A: Yes, we ship worldwide with tracking."
              rows={8}
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              className={cn(
                'transition-smooth resize-none font-mono text-sm',
                getError('faqs') ? 'border-destructive focus:ring-destructive' : ''
              )}
            />
            <div className="text-xs text-muted-foreground">
              Enter one question and answer per line, or use JSON format: [{`"q":"Question?","a":"Answer"`}]
            </div>
            {getError('faqs') && (
              <p className="text-sm text-destructive">{getError('faqs')}</p>
            )}
          </div>
          
          {/* Knowledge Files Upload */}
          <FileUpload
            files={knowledgeFiles}
            onFilesChange={setKnowledgeFiles}
            className="mb-6"
          />
          
          {/* Bot Display Name (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="bot_display_name" className="text-sm font-medium">
              Bot Display Name (Optional)
            </Label>
            <Input
              id="bot_display_name"
              placeholder="Leave empty to use business name"
              {...register('bot_display_name')}
              className="transition-smooth"
            />
            <p className="text-xs text-muted-foreground">
              The name shown to users when chatting with your bot
            </p>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary hover:opacity-90 transition-smooth text-white font-medium py-6 text-base shadow-primary"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" />
                Creating Your Chatbot...
              </div>
            ) : (
              'Create Chatbot'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default BusinessForm