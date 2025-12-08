'use client'

import { Button, Radio, RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { Container } from '@/components/container'
import { Logomark } from '@/components/logo'
import userStore from '@/store/user'
import axios from 'axios'
import { toast } from 'sonner'
import tokenStore from '../store/token'
import Loading from './loading/loading'

export interface Plan {
  id: number
  name: string
  price_monthly: number
  price_yearly: number
  featured: boolean
  description: string
  credit: number
  features_plans: {
    features: FeaturesPlan[]
    limits: FeaturesPlan[]
  }
}

export interface FeaturesPlan {
  feature: string
  description: string
  value: Value
}

export interface Value {
  type: string
  value: number | string | boolean | any[]
}

interface PlanProps extends Plan {
  activePeriod: 'Monthly' | 'Annually'
  logomarkClassName?: string
}

function CheckIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        fill="currentColor"
      />
      <circle
        cx="12"
        cy="12"
        r="8.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Plan({
  id,
  name,
  features_plans,
  price_monthly,
  description,
  price_yearly,
  featured = false,
  activePeriod,
  credit,
}: PlanProps) {
  const { addToken } = tokenStore()
  const { user, getCurrentUser, setPlan } = userStore()

  const handleStartPlan = async () => {
    alert(`Plan started with : ${name} with $${price_monthly} monthly or $${price_yearly} annually`)
    await addToken(credit, 'openai/gpt5', 'refund')
    toast.success(`Token added: ${credit} tokens for plan ${name}`)
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error('User not found')
    await setPlan(id, currentUser.id)
  }
  return (
    <section
      className={clsx(
        'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
        featured ? 'order-first bg-gray-900 lg:order-none' : 'bg-white'
      )}
    >
      <h3 className={clsx('flex items-center text-sm font-semibold', featured ? 'text-white' : 'text-gray-900')}>
        <Logomark className={clsx('h-6 w-6 flex-none', 'fill-gray-300')} />
        <span className="ml-4">{name}</span>
      </h3>
      <p className={clsx('relative mt-5 flex text-3xl tracking-tight', featured ? 'text-white' : 'text-gray-900')}>
        {price_monthly === price_yearly ? (
          `$${price_monthly}`
        ) : (
          <>
            <span
              aria-hidden={activePeriod === 'Annually'}
              className={clsx(
                'transition duration-300',
                activePeriod === 'Annually' && 'pointer-events-none translate-x-6 select-none opacity-0'
              )}
            >
              {`$${price_monthly}`}
            </span>
            <span
              aria-hidden={activePeriod === 'Monthly'}
              className={clsx(
                'absolute left-0 top-0 transition duration-300',
                activePeriod === 'Monthly' && 'pointer-events-none -translate-x-6 select-none opacity-0'
              )}
            >
              {`$${price_yearly}`}
            </span>
          </>
        )}
      </p>
      <p className={clsx('mt-3 text-sm', featured ? 'text-gray-300' : 'text-gray-700')}>{description}</p>
      <p className={clsx('mt-3 text-sm', featured ? 'text-gray-300' : 'text-gray-700')}>Credit:{credit}</p>
      <div className="order-last mt-6">
        <ul
          role="list"
          className={clsx(
            '-my-2 divide-y text-sm',
            featured ? 'divide-gray-800 text-gray-300' : 'divide-gray-200 text-gray-700'
          )}
        >
          {features_plans.features.map((feature, index) => (
            <li key={index} className="flex py-2">
              <CheckIcon className={clsx('h-6 w-6 flex-none', featured ? 'text-white' : 'text-cyan-500')} />
              <span className="ml-4">{feature.description}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        className={clsx('mt-6 rounded-md p-2 text-white', featured ? 'bg-cyan-500' : 'bg-gray-900')}
        aria-label={`Get started with the ${name} plan for ${price_monthly}`}
        onClick={handleStartPlan}
      >
        Commencer
      </Button>
    </section>
  )
}

export function Pricing() {
  let [activePeriod, setActivePeriod] = useState<'Monthly' | 'Annually'>('Monthly')
  const [loading, setLoading] = useState(true)
  const [plansAndFeatures, setPlansAndFeatures] = useState<Plan[]>([])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_ENDPOINT
        const res = await axios.get(`${url}/plans`)
        if (res.status === 200 || res.status === 201) {
          setPlansAndFeatures(res.data)
          console.log('Plans and features:', res.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Une erreur est survenue lors de la récupération des données')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    console.log('loading', plansAndFeatures)
  }, [plansAndFeatures])

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-title" className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
            Tweeksy pricing, no management fees.
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Whether you’re one person trying to get ahead or a big firm trying to take over the world, we’ve got a plan
            for you.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            <RadioGroup value={activePeriod} onChange={setActivePeriod} className="grid grid-cols-2">
              {['Monthly', 'Annually'].map((period) => (
                <Radio
                  key={period}
                  value={period}
                  className={clsx(
                    'cursor-pointer border border-gray-300 px-[calc(theme(spacing.3)-1px)] py-[calc(theme(spacing.2)-1px)] text-sm text-gray-700 outline-2 outline-offset-2 transition-colors hover:border-gray-400 dark:text-gray-100',
                    period === 'Monthly' ? 'rounded-l-lg' : '-ml-px rounded-r-lg'
                  )}
                >
                  {period}
                </Radio>
              ))}
            </RadioGroup>
            <div
              aria-hidden="true"
              className={clsx(
                'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 overflow-hidden rounded-lg bg-cyan-500 transition-all duration-300',
                activePeriod === 'Monthly' ? '[clip-path:inset(0_50%_0_0)]' : '[clip-path:inset(0_0_0_calc(50%-1px))]'
              )}
            >
              {['Monthly', 'Annually'].map((period) => (
                <div
                  key={period}
                  className={clsx(
                    'py-2 text-center text-sm font-semibold text-white',
                    period === 'Annually' && '-ml-px'
                  )}
                >
                  {period}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:max-w-none lg:grid-cols-3">
          {plansAndFeatures.map((plan) => (
            <Plan key={plan.name} {...plan} activePeriod={activePeriod} />
          ))}
        </div>

        {/*  */}

        <div className="mt-32">
          <table className="w-full text-left">
            <caption className="sr-only">Pricing plan comparison</caption>
            <thead>
              <tr className="max-sm:hidden">
                <td className="p-0"></td>
                {plansAndFeatures.map((plan) => (
                  <th key={plan.id} scope="col" className="p-0 data-[selected]:table-cell max-sm:hidden">
                    <div className="font-mono text-xs/5 font-semibold uppercase tracking-widest text-gray-900 dark:text-gray-200">
                      {plan.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Section: Features */}
              <tr>
                <th scope="colgroup" colSpan={plansAndFeatures.length + 1} className="px-0 pb-0 pt-10">
                  <div className="-mx-4 rounded-lg bg-gray-200 px-4 py-3 text-sm/6 font-semibold dark:bg-gray-900">
                    Features
                  </div>
                </th>
              </tr>
              {(() => {
                const longestFeaturesPlans = longestArray(
                  ...plansAndFeatures.map((plan) => plan.features_plans.features)
                )

                return longestFeaturesPlans.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-300 dark:border-gray-500">
                    <th scope="row" className="px-0 py-4 text-sm/6 font-normal text-gray-700 dark:text-gray-400">
                      {feature.feature}
                    </th>
                    {plansAndFeatures.map((plan) => (
                      <td key={plan.id} data-selected="true" className="p-4">
                        <div className="text-sm/6">
                          {renderData(plan.features_plans.features.find((f) => f.feature === feature.feature)?.value)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              })()}

              {/* Section: Limits */}
              <tr>
                <th scope="colgroup" colSpan={plansAndFeatures.length + 1} className="px-0 pb-0 pt-10">
                  <div className="-mx-4 rounded-lg bg-gray-200 px-4 py-3 text-sm/6 font-semibold dark:bg-gray-900">
                    Limits
                  </div>
                </th>
              </tr>
              {(() => {
                const longestLimitsPlans = longestArray(...plansAndFeatures.map((plan) => plan.features_plans.limits))

                return longestLimitsPlans.map((limit, index) => (
                  <tr key={index} className="border-b border-gray-300 dark:border-gray-500">
                    <th scope="row" className="px-0 py-4 text-sm/6 font-normal text-gray-700 dark:text-gray-400">
                      {limit.feature}
                    </th>
                    {plansAndFeatures.map((plan) => (
                      <td key={plan.id} data-selected="true" className="p-4">
                        <div className="text-sm/6">
                          {renderData(plan.features_plans.limits.find((l) => l.feature === limit.feature)?.value)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              })()}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}

function renderData(data: Value | undefined) {
  if (!data) return '-'
  switch (data.type) {
    case 'string':
      return data.value
    case 'number':
      return new Intl.NumberFormat('fr-FR').format(data.value as number)
    case 'boolean':
      return <CheckIcon className={'h-6 w-6 flex-none text-cyan-500'} />
    case 'array':
      return (
        <ul className="list-disc pl-2 text-sm">
          {(data.value as any[]).map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      )
    default:
      return '-'
  }
}

function longestArray<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return []
  return arrays.reduce((a, b) => (a.length > b.length ? a : b))
}
