# React Hook Form with Zod Validation Pattern

This document describes the required pattern for implementing forms in React/Next.js applications using react-hook-form with Zod validation.

## Overview

All forms MUST use:
- **react-hook-form** for form state management
- **Zod** for schema validation
- **Separate schema files** for type safety and reusability
- **Toast notifications** for user feedback (never use alert())

## Implementation Steps

### 1. Create Schema File

Create a schema file in `src/schemas/[feature]/[form-name].schema.ts`:

```typescript
import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().positive('Age must be positive'),
  isActive: z.boolean(),
  role: z.enum(['admin', 'user'], {
    required_error: 'Please select a role',
  }),
  description: z.string().optional(),
})

// Export the inferred type
export type UserFormData = z.infer<typeof userFormSchema>
```

### 2. Create Form Component

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userFormSchema, type UserFormData } from '~/schemas/admin/user.schema'
import { createUser, updateUser } from '~/actions/admin/users'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

interface UserFormProps {
  user?: User | null
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || '',
      nameAr: user?.nameAr || '',
      email: user?.email || '',
      age: user?.age || 0,
      isActive: user?.isActive ?? true,
      role: user?.role || 'user',
      description: user?.description || '',
    }
  })

  const { register, formState: { errors }, setValue, watch, handleSubmit } = form

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)

    try {
      const result = user
        ? await updateUser(user.id, data)
        : await createUser(data)

      if (result.success) {
        toast.success(user ? 'User updated successfully' : 'User created successfully')
        router.push('/admin/users')
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }, (validationErrors) => {
    // Optional: Handle validation errors globally
    console.error('Validation errors:', validationErrors)
    toast.error('Please check all required fields')
  })

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields... */}
    </form>
  )
}
```

### 3. Form Field Examples

#### Text Input with Error Display

```typescript
<div>
  <Label htmlFor="name">
    Name <span className="text-red-500">*</span>
  </Label>
  <Input
    id="name"
    {...register('name')}
    className={cn(
      errors.name && "border-red-500 focus:border-red-500"
    )}
  />
  {errors.name && (
    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
  )}
</div>
```

#### Number Input

```typescript
<div>
  <Label htmlFor="age">
    Age <span className="text-red-500">*</span>
  </Label>
  <Input
    id="age"
    type="number"
    {...register('age', { valueAsNumber: true })}
    className={cn(
      errors.age && "border-red-500 focus:border-red-500"
    )}
  />
  {errors.age && (
    <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
  )}
</div>
```

#### Select/Enum Field

```typescript
<div>
  <Label htmlFor="role">
    Role <span className="text-red-500">*</span>
  </Label>
  <Select
    value={watch('role')}
    onValueChange={(value) => setValue('role', value as 'admin' | 'user')}
  >
    <SelectTrigger className={cn(
      errors.role && "border-red-500 focus:border-red-500"
    )}>
      <SelectValue placeholder="Select a role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="admin">Admin</SelectItem>
      <SelectItem value="user">User</SelectItem>
    </SelectContent>
  </Select>
  {errors.role && (
    <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
  )}
</div>
```

#### Checkbox/Boolean Field

```typescript
<div className="flex items-center space-x-2">
  <Checkbox
    id="isActive"
    checked={watch('isActive')}
    onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
  />
  <Label
    htmlFor="isActive"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Active
  </Label>
</div>
```

#### Image Upload Field

```typescript
<div>
  <Label>
    Profile Image <span className="text-red-500">*</span>
  </Label>
  <ImageUpload
    label="Profile Image"
    value={watch('imageUrl')}
    onChange={(url) => setValue('imageUrl', url)}
    onRemove={() => setValue('imageUrl', '')}
    className={errors.imageUrl ? 'border-red-500' : ''}
  />
  {errors.imageUrl && (
    <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>
  )}
</div>
```

#### Multi-Language Input

```typescript
<MultiLangInput
  label="Name"
  name="name"
  nameAr="nameAr"
  value={watch('name')}
  valueAr={watch('nameAr')}
  onChange={(name, value) => setValue(name as keyof UserFormData, value)}
  error={errors.name?.message}
  errorAr={errors.nameAr?.message}
  required
/>
```

### 4. Server Action Implementation

```typescript
'use server'

import { db } from '~/server/db'
import { revalidatePath } from 'next/cache'
import { userFormSchema, type UserFormData } from '~/schemas/admin/user.schema'

export async function createUser(data: UserFormData) {
  try {
    // Validate data with the same schema
    const validatedData = userFormSchema.parse(data)

    const user = await db.user.create({
      data: validatedData
    })

    revalidatePath('/admin/users')
    
    return { success: true, id: user.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data provided' }
    }
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function updateUser(id: string, data: UserFormData) {
  try {
    const validatedData = userFormSchema.parse(data)

    await db.user.update({
      where: { id },
      data: validatedData
    })

    revalidatePath('/admin/users')
    
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data provided' }
    }
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}
```

## Best Practices

### 1. Schema Organization

- Place schemas in `src/schemas/[feature]/` directory
- Use descriptive file names: `user.schema.ts`, `product.schema.ts`
- Export both the schema and the inferred type
- Use consistent error messages (consider i18n for multi-language apps)

### 2. Form State Management

- Always use `useForm` hook with zodResolver
- Provide complete defaultValues to avoid controlled/uncontrolled warnings
- Use `watch` for reactive form values
- Use `setValue` for programmatic updates
- Use `register` for native HTML inputs

### 3. Error Handling

- Display field-level errors immediately below the input
- Use consistent error styling (red border, red text)
- Show toast notifications for form-level success/error
- Never use `alert()` - always use toast notifications
- Log errors to console for debugging

### 4. Accessibility

- Always include labels for form fields
- Mark required fields with red asterisk
- Use proper HTML semantic elements
- Include helpful error messages
- Ensure keyboard navigation works

### 5. Type Safety

- Never use `any` type
- Import and reuse schema types in server actions
- Use the inferred type from Zod schema
- Ensure defaultValues match the schema type

## Common Patterns

### 1. Conditional Validation

```typescript
const schema = z.object({
  hasDiscount: z.boolean(),
  discountPercentage: z.number().optional(),
}).refine(
  (data) => {
    if (data.hasDiscount) {
      return data.discountPercentage !== undefined && data.discountPercentage > 0
    }
    return true
  },
  {
    message: "Discount percentage is required when discount is enabled",
    path: ["discountPercentage"],
  }
)
```

### 2. Custom Error Messages

```typescript
const schema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})
```

### 3. Array Fields

```typescript
const schema = z.object({
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  items: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
  })),
})
```

### 4. Optional Fields with Transformation

```typescript
const schema = z.object({
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().regex(/^\+?[0-9]+$/).optional().or(z.literal('')),
})
```

## Migration Guide

When migrating existing forms to this pattern:

1. **Create the schema file** first
2. **Update the form component** to use react-hook-form
3. **Update server actions** to import and use the schema
4. **Replace alert() with toast** notifications
5. **Add error displays** for each field
6. **Test thoroughly** with invalid data

## Checklist

Before considering a form complete, ensure:

- [ ] Schema defined in separate file
- [ ] Form uses react-hook-form with zodResolver
- [ ] Server actions import and use the same schema
- [ ] All fields show validation errors
- [ ] Required fields marked with red asterisk
- [ ] Toast notifications used (no alert())
- [ ] Form is fully typed (no `any`)
- [ ] Proper loading states during submission
- [ ] Form redirects after successful submission
- [ ] All edge cases handled gracefully