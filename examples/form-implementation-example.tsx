// Example: Complete Form Implementation with React Hook Form + Zod

// 1. Schema File: src/schemas/admin/product.schema.ts
import { z } from 'zod'

export const productFormSchema = z.object({
  // Basic fields
  name: z.string().min(1, 'Product name is required'),
  nameAr: z.string().min(1, 'اسم المنتج مطلوب'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionAr: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  
  // Number fields
  price: z.number()
    .positive('Price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  
  // Enum field
  category: z.enum(['electronics', 'clothing', 'food', 'other'], {
    required_error: 'Please select a category',
  }),
  
  // Boolean field
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  
  // Optional fields
  discount: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  
  // Array field
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  
  // Date field
  releaseDate: z.date({
    required_error: 'Release date is required',
  }),
}).refine(
  (data) => {
    // Custom validation: If featured, must have an image
    if (data.isFeatured && !data.imageUrl) {
      return false
    }
    return true
  },
  {
    message: 'Featured products must have an image',
    path: ['imageUrl'],
  }
)

export type ProductFormData = z.infer<typeof productFormSchema>

// 2. Form Component: src/components/admin/products/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema, type ProductFormData } from '~/schemas/admin/product.schema'
import { createProduct, updateProduct } from '~/actions/admin/products'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { MultiLangInput } from '~/components/admin/forms/MultiLangInput'
import { ImageUpload } from '~/components/admin/forms/ImageUpload'
import { TagInput } from '~/components/admin/forms/TagInput'
import { DatePicker } from '~/components/ui/date-picker'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { Loader2 } from 'lucide-react'
import type { Product } from '@prisma/client'

interface ProductFormProps {
  product?: Product | null
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      nameAr: product?.nameAr || '',
      description: product?.description || '',
      descriptionAr: product?.descriptionAr || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      category: product?.category || 'other',
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      discount: product?.discount || undefined,
      imageUrl: product?.imageUrl || '',
      tags: product?.tags || [''],
      releaseDate: product?.releaseDate || new Date(),
    }
  })

  const { register, formState: { errors }, setValue, watch, handleSubmit } = form

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data)

      if (result.success) {
        toast.success(product ? 'Product updated successfully' : 'Product created successfully')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, (validationErrors) => {
    // Handle validation errors
    console.error('Validation errors:', validationErrors)
    const errorMessages: string[] = []
    
    Object.entries(validationErrors).forEach(([field, error]) => {
      if (error?.message) {
        errorMessages.push(`${field}: ${error.message}`)
      }
    })
    
    if (errorMessages.length > 0) {
      toast.error('Please fix the following errors:\n' + errorMessages.join('\n'))
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multi-language name input */}
          <MultiLangInput
            label="Product Name"
            name="name"
            nameAr="nameAr"
            value={watch('name')}
            valueAr={watch('nameAr')}
            onChange={(name, value) => setValue(name as keyof ProductFormData, value)}
            error={errors.name?.message}
            errorAr={errors.nameAr?.message}
            required
          />

          {/* Multi-language description */}
          <MultiLangInput
            label="Description"
            name="description"
            nameAr="descriptionAr"
            value={watch('description')}
            valueAr={watch('descriptionAr')}
            onChange={(name, value) => setValue(name as keyof ProductFormData, value)}
            error={errors.description?.message}
            errorAr={errors.descriptionAr?.message}
            type="textarea"
            rows={4}
            required
          />

          {/* Category select */}
          <div>
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value as ProductFormData['category'])}
            >
              <SelectTrigger className={cn(
                errors.category && "border-red-500 focus:border-red-500"
              )}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Price input */}
            <div>
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={cn(
                  errors.price && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Stock input */}
            <div>
              <Label htmlFor="stock">
                Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className={cn(
                  errors.stock && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.stock && (
                <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Optional discount */}
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              {...register('discount', { 
                valueAsNumber: true,
                setValueAs: (v) => v === '' ? undefined : Number(v)
              })}
              className={cn(
                errors.discount && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.discount && (
              <p className="text-sm text-red-500 mt-1">{errors.discount.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media and Display */}
      <Card>
        <CardHeader>
          <CardTitle>Media & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image upload */}
          <div>
            <Label>
              Product Image
              {watch('isFeatured') && <span className="text-red-500">*</span>}
            </Label>
            <ImageUpload
              label="Product Image"
              value={watch('imageUrl') || ''}
              onChange={(url) => setValue('imageUrl', url)}
              onRemove={() => setValue('imageUrl', '')}
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Tags input */}
          <div>
            <Label>
              Tags <span className="text-red-500">*</span>
            </Label>
            <TagInput
              value={watch('tags')}
              onChange={(tags) => setValue('tags', tags)}
              placeholder="Add tags..."
              className={errors.tags ? 'border-red-500' : ''}
            />
            {errors.tags && (
              <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* Release date */}
          <div>
            <Label>
              Release Date <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={watch('releaseDate')}
              onChange={(date) => setValue('releaseDate', date || new Date())}
              className={errors.releaseDate ? 'border-red-500' : ''}
            />
            {errors.releaseDate && (
              <p className="text-sm text-red-500 mt-1">{errors.releaseDate.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active switch */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this product visible to customers
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>

          {/* Featured switch */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured">Featured</Label>
              <p className="text-sm text-muted-foreground">
                Display this product in featured sections
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={watch('isFeatured')}
              onCheckedChange={(checked) => setValue('isFeatured', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

// 3. Server Actions: src/actions/admin/products.ts
'use server'

import { db } from '~/server/db'
import { revalidatePath } from 'next/cache'
import { productFormSchema, type ProductFormData } from '~/schemas/admin/product.schema'
import { z } from 'zod'

export async function createProduct(data: ProductFormData) {
  try {
    // Validate with the same schema
    const validatedData = productFormSchema.parse(data)

    const product = await db.product.create({
      data: {
        ...validatedData,
        // Convert date to ISO string if needed by your DB
        releaseDate: validatedData.releaseDate.toISOString(),
      }
    })

    revalidatePath('/admin/products')
    
    return { success: true, id: product.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid data: ' + error.errors.map(e => e.message).join(', ')
      }
    }
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const validatedData = productFormSchema.parse(data)

    await db.product.update({
      where: { id },
      data: {
        ...validatedData,
        releaseDate: validatedData.releaseDate.toISOString(),
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/products/${id}`)
    
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: 'Invalid data: ' + error.errors.map(e => e.message).join(', ')
      }
    }
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}