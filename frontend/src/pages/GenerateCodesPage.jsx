import { useEffect, useState } from 'react';
import { Download, KeyRound, LoaderCircle } from 'lucide-react';
import { apiRequest } from '../api';
import { Notice } from '../components/ui';

export default function GenerateCodesPage() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest('/products?limit=100').then(({ data }) => {
      const active = data.products.filter((product) => product.status === 'active');
      setProducts(active); setProductId(active[0]?._id ?? '');
    }).catch((err) => setError(err.message));
  }, []);

  const generate = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setCodes([]);
    try {
      const response = await apiRequest(`/products/${productId}/codes`, { method: 'POST', body: { quantity: Number(quantity) } });
      setCodes(response.data.codes);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const download = () => {
    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'verification-codes.txt'; link.click(); URL.revokeObjectURL(url);
  };

  return <main className="min-h-screen bg-slate-50"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-6 py-9 lg:px-8"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600"><KeyRound className="size-4" /> Product protection</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Generate verification codes</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Select a product and generate one unique code for each physical unit. QR scanning remains optional and is not required for verification.</p></div></section><div className="mx-auto max-w-5xl px-6 py-8 lg:px-8"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><form onSubmit={generate} className="grid gap-5 sm:grid-cols-[1fr_180px_auto] sm:items-end"><label className="grid gap-2 text-sm font-bold text-slate-700">Active product<select value={productId} onChange={(e) => setProductId(e.target.value)} required className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm">{products.length === 0 && <option value="">No active products</option>}{products.map((product) => <option value={product._id} key={product._id}>{product.name} · {product.sku}</option>)}</select></label><label className="grid gap-2 text-sm font-bold text-slate-700">Quantity (1–500)<input type="number" min="1" max="500" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="rounded-xl border border-slate-300 px-4 py-3 text-sm" /></label><button disabled={loading || !productId} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50">{loading && <LoaderCircle className="size-4 animate-spin" />}{loading ? 'Generating' : 'Generate codes'}</button></form>{error && <div className="mt-5"><Notice message={error} /></div>}</section>{codes.length > 0 && <section className="mt-6 rounded-2xl border border-emerald-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-emerald-100 p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-black text-slate-950">{codes.length} codes ready</h2><p className="mt-1 text-sm text-slate-500">Download these now. For security, only their hashes are stored.</p></div><button onClick={download} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"><Download className="size-4" /> Download .txt</button></div><pre className="max-h-96 overflow-auto p-6 text-sm leading-7 text-slate-700">{codes.join('\n')}</pre></section>}</div></main>;
}
