## 🚨 CRITICAL DEVELOPMENT RULES - ALWAYS FOLLOW

### React/Next.js Specific Rules
1. **React Hook Dependencies**: When useEffect shows dependency warnings, add `// eslint-disable-next-line react-hooks/exhaustive-deps` comment instead of adding functions to dependency array (which can cause infinite loops)
2. **Next.js Image Optimization**: Always use `next/image` component instead of HTML `<img>` tags. Convert with proper width/height props:
   ```tsx
   // Bad
   <img src={url} alt={alt} className="..." />
   
   // Good
   import Image from 'next/image'
   <Image src={url} alt={alt} width={1000} height={1000} className="..." />
   ```

### Form Implementation Pattern (REQUIRED)
All forms MUST be implemented using react-hook-form with Zod validation following this exact pattern:

1. **Schema Definition**: Create a separate schema file in `src/schemas/[feature]/` directory:
   ```typescript
   import { z } from 'zod'
   
   export const myFormSchema = z.object({
     name: z.string().min(1, 'Name is required'),
     email: z.string().email('Invalid email'),
     // ... other fields
   })
   
   export type MyFormData = z.infer<typeof myFormSchema>
   ```

2. **Form Component**: Use react-hook-form with zodResolver:
   ```typescript
   import { useForm } from 'react-hook-form'
   import { zodResolver } from '@hookform/resolvers/zod'
   import { myFormSchema, type MyFormData } from '~/schemas/feature/my-form.schema'
   import { toast } from 'sonner'
   
   const form = useForm<MyFormData>({
     resolver: zodResolver(myFormSchema),
     defaultValues: {
       // ... default values
     }
   })
   
   const { register, formState: { errors }, setValue, watch, handleSubmit } = form
   ```

3. **Server Actions**: Import and reuse the same schema:
   ```typescript
   import { myFormSchema, type MyFormData } from '~/schemas/feature/my-form.schema'
   
   export async function createItem(data: MyFormData) {
     const validatedData = myFormSchema.parse(data)
     // ... rest of implementation
   }
   ```

4. **Error Handling**: Use toast notifications, never use alert():
   ```typescript
   toast.success('Item created successfully')
   toast.error('Failed to create item')
   ```

5. **Field Error Display**: 
   - When using custom inputs or shadcn/ui components without Form wrapper:
     ```typescript
     {errors.fieldName && (
       <p className="text-sm text-red-500 mt-1">{errors.fieldName.message}</p>
     )}
     ```
   - When using shadcn/ui Form components (preferred for complex forms):
     ```typescript
     <Form {...form}>
       <FormField
         control={form.control}
         name="fieldName"
         render={({ field }) => (
           <FormItem>
             <FormLabel>Field Name <span className="text-red-500">*</span></FormLabel>
             <FormControl>
               <Input {...field} />
             </FormControl>
             <FormMessage /> {/* Automatically shows errors */}
           </FormItem>
         )}
       />
     </Form>
     ```

6. **Required Fields**: Mark required fields with red asterisk:
   ```typescript
   <Label>Field Name <span className="text-red-500">*</span></Label>
   ```

This pattern ensures consistent validation, type safety, and user experience across all forms.

## 🚨 CRITICAL DEVELOPMENT RULES - ALWAYS FOLLOW

1. **Run tests after EVERY change**: Always run linting and type checking after any code modification
   - For projects with scripts: `npm run lint && npm run typecheck` or `bun run lint && bun run typecheck`
   - If no typecheck script exists, use: `tsc --noEmit` or add it to package.json
   - **NEVER run `npm run dev` or start development servers** - focus on code changes only
2. **NEVER use type assertions**: No `as Type` ever - refactor code structure if needed
3. **NEVER use 'any' type**: Always use proper TypeScript types
4. **Avoid code duplication**: Create reusable shared components
   - Extract common UI patterns into shared components
   - Use composition over duplication
   - Place shared components in appropriate shared folders
5. **Match existing UI patterns**: Study and follow each project's design system
   - Check similar components for styling patterns
   - Maintain consistent spacing, colors, hover states
   - Follow established card designs and layouts
6. **Use smaller separate components**: Always break down large components for better maintainability
   - Each component should have a single responsibility
   - Extract complex logic into custom hooks
   - Keep components under 200 lines when possible
   - Create sub-components for repeated UI patterns
   - Separate concerns: presentation, logic, and data fetching
   - Use descriptive component names that reflect their purpose

## General Best Practices

1. **Always use Server Actions for data mutations** (Next.js projects)
   - Never mutate data directly in client components
   - Use server actions for all database operations
   - Return properly typed responses

2. **Never expose sensitive data** in client components
   - Keep API keys, secrets, and sensitive logic server-side
   - Sanitize data before sending to client

3. **Keep dependencies updated** regularly
   - Check for security vulnerabilities
   - Update incrementally to avoid breaking changes

4. **Document complex logic** with comments
   - Explain "why" not "what"
   - Document business logic and edge cases

5. **Use meaningful commit messages**
   - Follow conventional commits when applicable
   - Include context and reasoning for changes

6. **Validate all user inputs**
   - Never trust client-side data
   - Use validation libraries (Zod when available)
   - Validate at the server boundary

7. **Handle all error states** gracefully
   - Provide user-friendly error messages
   - Log errors appropriately
   - Never expose internal errors to users

8. **Clean up unused code**
   - Remove unused imports immediately
   - Delete commented code unless it's documentation
   - Remove unused parameters and variables
   - Keep components lean and focused

9. **Move Prisma to Server Actions** (Next.js + Prisma projects)
   - Never use Prisma in client components
   - Create organized action files by domain
   - Handle errors with try-catch blocks
   - Return typed responses

10. **Encapsulate related logic into single functions**
   - When you have related code (constants, transformations, configurations), put them inside a single function
   - The function should return everything needed, fully prepared for use
   - This makes components cleaner and more readable by removing setup logic
   - Example: Instead of having STATUS_ICONS constant and transformation logic in component, create `getViewStatusConfigWithIcons()` that encapsulates all of it
   - Benefits:
     - Components focus on their primary purpose
     - Related logic stays together
     - Easier to test and reuse
     - Reduces cognitive load when reading components

11. **Never pass components as props**
   - Don't pass React components as props unless absolutely necessary
   - Instead, import components directly where they're used and conditionally render based on props
   - Example: Instead of `<Component HeaderComponent={ClientHeader} />`, do the import inside Component and render `{viewType === 'client' ? <ClientHeader /> : <ServerHeader />}`
   - Benefits:
     - Better tree shaking and code splitting
     - Clearer component dependencies
     - Easier to understand component structure
     - Avoids complex prop typing for components
     - Better for performance optimization

## Arabic/English Field Validation Pattern

### Critical Rules for Bilingual Fields
All forms with Arabic/English field pairs MUST follow these rules:

1. **Prisma Schema Consistency**: Arabic and English fields MUST have the same optionality
   ```prisma
   // ✅ CORRECT - Both required
   model Entity {
     name      String
     nameAr    String
   }
   
   // ✅ CORRECT - Both optional  
   model Entity {
     description   String?
     descriptionAr String?
   }
   
   // ❌ WRONG - Mixed optionality
   model Entity {
     description   String   // Required
     descriptionAr String?  // Optional - THIS IS WRONG!
   }
   ```

2. **Optional Field Validation**: If one language is provided, the other MUST be provided
   - Frontend: Use `crossValidate={true}` on MultiLangInput components
   - Backend: Use `createArEnValidation()` helper from `~/lib/validation-helpers`
   - Error message: "يجب إدخال النص بالعربية والإنجليزية معاً أو تركهما فارغين"

3. **Implementation Example**:
   ```typescript
   // Frontend - MultiLangInput with cross-validation
   <MultiLangInput
     label="الوصف"
     name="description"
     nameAr="descriptionAr"
     value={watch('description') || ''}
     valueAr={watch('descriptionAr') || ''}
     onChange={(name, value) => setValue(name as keyof FormData, value)}
     crossValidate={true} // REQUIRED for optional fields
   />
   
   // Backend - Zod schema with validation
   import { createArEnValidation } from '~/lib/validation-helpers'
   
   const schema = z.object({
     title: z.string().min(1, 'العنوان بالإنجليزية مطلوب'),
     titleAr: z.string().min(1, 'العنوان بالعربية مطلوب'),
     description: z.string().optional(),
     descriptionAr: z.string().optional(),
   }).refine(
     createArEnValidation([
       { en: 'description', ar: 'descriptionAr' }
     ]),
     {
       message: "يجب إدخال النص بالعربية والإنجليزية معاً أو تركهما فارغين",
       path: ["descriptionAr"],
     }
   )
   ```

## Admin Table Design System Patterns

### Badge Styling Pattern
- **Always use `variant="secondary"`** with purple theme for data badges:
  ```tsx
  <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
  ```
- **Never use `variant="outline"`** for data display (only for special states)
- **Add `text-xs`** for smaller badges (counts, metadata)

### Badge Usage Rules
1. **Numeric values** (counts, orders): Always display in badges, never plain text
2. **Boolean/Status values**: Use checkmark badge `✓` instead of text
3. **Categories/Types**: Use colored badges with consistent theming
4. **Missing data**: Use `<span className="text-muted-foreground">-</span>`

### Multi-Value Display Pattern (sectors, tags, etc.)
```tsx
// Show first 2 items + overflow count
<div className="flex flex-wrap gap-1 max-w-xs">
  {items.slice(0, 2).map(item => (
    <Badge key={item.id} variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
      {item.nameAr || item.name}
    </Badge>
  ))}
  {items.length > 2 && (
    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
      +{items.length - 2}
    </Badge>
  )}
</div>
```

### Delete Confirmation Pattern
- **Always use shared component**: `DeleteConfirmDialog`
- **State pattern**:
  ```tsx
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Type | null>(null)
  ```
- **Never use inline confirmations** or custom AlertDialog implementations

## Environment Awareness
- Remember globally that you are working on WSL (Windows Subsystem for Linux)

## Development Workflow on WSL
- **Primary Development Location**: Always work in `/home/hossam/projects/` directory for all projects
- **Performance**: WSL native filesystem provides 10-20x faster file operations than Windows mounts
- **Git Operations**: All git commands should be executed in WSL for optimal performance
- **IDE Connection**: Developer connects Cursor/VS Code to WSL using Remote-WSL extension
- **Workflow**:
  1. Clone all projects to `~/projects/` directory
  2. Perform all development operations in WSL filesystem
  3. Push changes to remote repository from WSL
  4. Windows copies are only for reference (pull from remote if needed)
- **Never** develop in `/mnt/` paths - always use native WSL paths
- **Project Structure**: `/home/hossam/projects/<project-name>/`

## Claude Configuration Sync
- **Configuration Repository**: `~/projects/claude-config` contains my global memory and workflow docs
- **Auto-sync Rule**: Whenever my global memory (this file) is updated, I must:
  1. Copy the updated file to `~/projects/claude-config/CLAUDE.md`
  2. Commit the changes with a descriptive message
  3. Push to the remote repository
  4. This ensures configuration consistency across all devices

## Session Management Commands
- **Purpose**: Track and document development sessions for better context preservation
- **Commands Directory**: `~/projects/claude-config/commands/` contains session management commands
- **Sessions Directory**: `~/projects/claude-config/sessions/` stores session documentation

### Available Commands
1. **Start Session**: `/project:session-start [optional-name]`
   - Creates a new timestamped session file
   - Initializes session tracking with goals and context
   - Records starting git status

2. **Update Session**: `/project:session-update [optional-notes]`
   - Adds timestamped progress updates to current session
   - Tracks git changes and todo status
   - Documents ongoing work and decisions

3. **End Session**: `/project:session-end`
   - Generates comprehensive session summary
   - Documents final git status and changes
   - Clears active session tracker

### Session Workflow
1. Start each development session with `/project:session-start`
2. Periodically update progress with `/project:session-update`
3. End sessions with `/project:session-end` to create summary
4. Session files provide context for future work

### Benefits
- Maintains context between Claude conversations
- Documents decision-making process
- Tracks progress systematically
- Enables knowledge transfer across sessions