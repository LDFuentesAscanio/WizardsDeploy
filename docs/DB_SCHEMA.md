# DB_SCHEMA.md

Tablas detectadas en `src/types/supabase.ts`:

- `categories`
- `contracted_expertise`
- `contracted_professions`
- `contracted_skills`
- `contracted_solutions`
- `contracted_tools`
- `country`
- `customer_media`
- `customers`
- `expert_documents`
- `expert_expertise`
- `expert_media`
- `experts`
- `it_professions`
- `it_projects`
- `platforms`
- `skills`
- `subcategories`
- `tools`
- `user_role`
- `users`

## Relaciones destacadas (del código)

- `contracted_solutions.subcategory_id` → `subcategories.id`
- `contracted_solutions.it_projects_id` → `it_projects.id`
- `it_projects.customer_id` → `customers.id`
- `expert_media.expert_id` → `experts.id`
- `expert_expertise.expert_id` → `experts.id`
- `experts.user_id` / `customers.user_id` → `auth.users.id` (vía vista `users`)
- `subcategories.category_id` → `categories.id`

> Si agregás FKs nuevas, recordá regenerar tipos y revisar RLS.
