'use client';

import { SectionHeader } from '@/components/home/section-header';
import {
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  Server,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAvailableModels } from '@/hooks/react-query/subscriptions/use-billing';
import type { Model } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// Example task data with token usage
const exampleTasks = [
  {
    name: 'Social Automation System',
    complexity: 'Complex',
    complexityVariant: 'destructive' as const,
    inputTokens: 3410337,
    outputTokens: 93616,
    duration: '35 minutes',
    originalModel: 'claude-sonnet-4',
  },
  {
    name: 'Content Marketing Strategy',
    complexity: 'Standard Complexity',
    complexityVariant: 'secondary' as const,
    inputTokens: 212312,
    outputTokens: 3378,
    duration: '11 minutes',
    originalModel: 'claude-sonnet-4',
  },
  {
    name: 'Go-to-Market Strategy',
    complexity: 'Standard Complexity',
    complexityVariant: 'secondary' as const,
    inputTokens: 307719,
    outputTokens: 24033,
    duration: '16 minutes',
    originalModel: 'claude-sonnet-4',
  },
  {
    name: 'Learning Path Generator',
    complexity: 'Standard Complexity',
    complexityVariant: 'secondary' as const,
    inputTokens: 90953,
    outputTokens: 17472,
    duration: '5 minutes',
    originalModel: 'claude-sonnet-4',
  },
  {
    name: 'Customer Journey Mapping',
    complexity: 'Complex',
    complexityVariant: 'destructive' as const,
    inputTokens: 360013,
    outputTokens: 17287,
    duration: '20 minutes',
    originalModel: 'claude-sonnet-4',
  },
  {
    name: 'Sales Funnel Optimization',
    complexity: 'Complex',
    complexityVariant: 'destructive' as const,
    inputTokens: 559918,
    outputTokens: 33392,
    duration: '14 minutes',
    originalModel: 'claude-sonnet-4',
  },
];

export default function PricingPage() {
  const {
    data: modelsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useAvailableModels();

  const [selectedModelId, setSelectedModelId] = useState<string>(
    'anthropic/claude-sonnet-4-20250514',
  );

  // Filter to only show models that have pricing information available
  const models =
    modelsResponse?.models?.filter((model: Model) => {
      return (
        model.input_cost_per_million_tokens !== null &&
        model.input_cost_per_million_tokens !== undefined &&
        model.output_cost_per_million_tokens !== null &&
        model.output_cost_per_million_tokens !== undefined
      );
    }) || [];

  // Find the selected model
  const selectedModel = models.find((model) => model.id === selectedModelId);

  // Function to calculate cost based on tokens and model pricing
  const calculateCost = (
    inputTokens: number,
    outputTokens: number,
    model: Model,
  ) => {
    if (
      !model.input_cost_per_million_tokens ||
      !model.output_cost_per_million_tokens
    ) {
      return 0;
    }

    const inputCost =
      (inputTokens / 1000000) * model.input_cost_per_million_tokens;
    const outputCost =
      (outputTokens / 1000000) * model.output_cost_per_million_tokens;

    return inputCost + outputCost;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">
            Loading pricing data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Pricing Unavailable
            </h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'Failed to fetch model pricing'}
            </p>
          </div>
          <Button onClick={() => refetch()} size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Credits & Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Understand how credits work, explore pricing for AI models, and find
          the right plan for your needs.
        </p>
      </div>

      {/* What are Credits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            What are credits?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Credits are our standard unit of measurement for platform usage -
            the more complex or lengthy the task, the more credits it requires.
            Credits provide a unified way to measure consumption across
            different types of AI operations and computational resources.
          </p>
        </CardContent>
      </Card>

      {/* How Credits Work Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-green-500" />
            How do credits work?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Credits are consumed based on AI model usage. We apply a 50% markup
            over the direct model provider costs. The specific credits
            consumption is determined by the model used and the number of tokens
            processed (both input and output tokens).
          </p>
        </CardContent>
      </Card>

      {/* Usage Examples Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            Usage Examples
          </CardTitle>
          <CardDescription>
            Here are some examples demonstrating credits consumption across
            different task types and complexity levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select a model to see pricing:
              </label>
              <Select
                value={selectedModelId}
                onValueChange={setSelectedModelId}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choose a model to calculate costs" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Example Tasks Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {exampleTasks.map((task, index) => {
                const calculatedCost = selectedModel
                  ? calculateCost(
                      task.inputTokens,
                      task.outputTokens,
                      selectedModel,
                    )
                  : null;

                return (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        {task.name}
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm mt-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>
                          {selectedModel?.display_name || task.originalModel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Input Tokens:
                        </span>
                        <span>{task.inputTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Output Tokens:
                        </span>
                        <span>{task.outputTokens.toLocaleString()}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{task.duration}</span>
                      </div> */}
                      <div className="flex justify-between font-semibold">
                        <span className="text-muted-foreground">Cost:</span>
                        {calculatedCost !== null ? (
                          <span className="text-blue-600">
                            ${calculatedCost.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Select model above
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compute Pricing by Model</CardTitle>
          <CardDescription>
            Detailed pricing information for available AI models. We apply a 50%
            markup on direct LLM provider costs to maintain our service and
            generate profit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-card border border-border rounded-lg">
            <div className="px-6 py-4 border-b border-border">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
                <div className="col-span-1">Model</div>
                <div className="col-span-1 text-center">Input Cost</div>
                <div className="col-span-1 text-center">Output Cost</div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {models.map((model, index) => (
                <div
                  key={model.id}
                  className={`px-6 py-4 hover:bg-muted/50 transition-colors duration-150 ${
                    selectedModelId === model.id
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Model Name */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">
                            {model.display_name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Cost */}
                    <div className="col-span-1 text-center">
                      <div className="space-y-1">
                        {model.input_cost_per_million_tokens !== null &&
                        model.input_cost_per_million_tokens !== undefined ? (
                          <>
                            <div className="font-semibold text-foreground">
                              ${model.input_cost_per_million_tokens.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per 1M tokens
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-muted-foreground">
                            —
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Output Cost */}
                    <div className="col-span-1 text-center">
                      <div className="space-y-1">
                        {model.output_cost_per_million_tokens !== null &&
                        model.output_cost_per_million_tokens !== undefined ? (
                          <>
                            <div className="font-semibold text-foreground">
                              ${model.output_cost_per_million_tokens.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per 1M tokens
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-muted-foreground">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
