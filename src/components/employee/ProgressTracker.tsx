import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProgressTrackerProps {
  orderId: string;
  orderNumber: string;
}

interface OrderProgress {
  making_progress: number;
  putting_in_cup_progress: number;
  delivering_progress: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ orderId, orderNumber }) => {
  const [progress, setProgress] = useState<OrderProgress>({
    making_progress: 0,
    putting_in_cup_progress: 0,
    delivering_progress: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, [orderId]);

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('order_progress')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching progress:', error);
        return;
      }

      if (data) {
        setProgress({
          making_progress: data.making_progress,
          putting_in_cup_progress: data.putting_in_cup_progress,
          delivering_progress: data.delivering_progress,
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const updateProgress = async (step: keyof OrderProgress, value: number) => {
    setLoading(true);
    try {
      // First check if progress record exists
      const { data: existingProgress } = await supabase
        .from('order_progress')
        .select('id')
        .eq('order_id', orderId)
        .single();

      const updatedProgress = { ...progress, [step]: value };

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from('order_progress')
          .update(updatedProgress)
          .eq('order_id', orderId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('order_progress')
          .insert({
            order_id: orderId,
            ...updatedProgress,
          });

        if (error) throw error;
      }

      setProgress(updatedProgress);
      toast.success(`${step.replace('_', ' ')} updated to ${value}%`);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Order Progress - {orderNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Making ({progress.making_progress}%)</label>
              <Button
                size="sm"
                onClick={() => updateProgress('making_progress', progress.making_progress)}
                disabled={loading}
              >
                Update
              </Button>
            </div>
            <Slider
              value={[progress.making_progress]}
              onValueChange={(values) => 
                setProgress(prev => ({ ...prev, making_progress: values[0] }))
              }
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Putting in Cup ({progress.putting_in_cup_progress}%)</label>
              <Button
                size="sm"
                onClick={() => updateProgress('putting_in_cup_progress', progress.putting_in_cup_progress)}
                disabled={loading}
              >
                Update
              </Button>
            </div>
            <Slider
              value={[progress.putting_in_cup_progress]}
              onValueChange={(values) => 
                setProgress(prev => ({ ...prev, putting_in_cup_progress: values[0] }))
              }
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Delivering ({progress.delivering_progress}%)</label>
              <Button
                size="sm"
                onClick={() => updateProgress('delivering_progress', progress.delivering_progress)}
                disabled={loading}
              >
                Update
              </Button>
            </div>
            <Slider
              value={[progress.delivering_progress]}
              onValueChange={(values) => 
                setProgress(prev => ({ ...prev, delivering_progress: values[0] }))
              }
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};