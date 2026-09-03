// Lightweight stub for Supabase client used by the app when running frontend-only
// This provides minimal, non-throwing methods so pages/components that import
// `createClient` keep working without a Supabase backend.

type AnyData = any

class StubQuery {
  private table: string
  constructor(table: string) {
    this.table = table
  }

  select(_cols?: string) { return this }
  eq(_col: string, _val: any) { return this }
  neq(_col: string, _val: any) { return this }
  limit(_n: number) { return this }
  single() { return this }
  async update(_payload: AnyData) { return { data: null, error: null } }
  async insert(_payload: AnyData) { return { data: null, error: null } }
  async upload?(_path: string, _body: any, _opts?: any) { return { data: null, error: null } }
  async then(resolve: any) { return resolve({ data: null }) }
}

function createClient() {
  return {
    from: (table: string) => new StubQuery(table),
    auth: {
      async getUser() {
        return { data: { user: null } }
      },
    },
    storage: {
      from: (_bucket: string) => ({
        async upload(_path: string, _body: any, _opts?: any) {
          return { data: null, error: null }
        },
        getPublicUrl(_path: string) {
          return { data: { publicUrl: null } }
        },
      }),
    },
  }
}

export { createClient }
