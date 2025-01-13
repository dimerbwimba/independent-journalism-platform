import { ChartBarIcon, CurrencyDollarIcon, UsersIcon, InformationCircleIcon, HomeIcon, HomeModernIcon, BuildingOffice2Icon, BuildingOfficeIcon, SparklesIcon, MapPinIcon, GlobeAltIcon, TruckIcon, TagIcon, Square3Stack3DIcon, SunIcon, MoonIcon, BeakerIcon, ShoppingBagIcon, ArrowTopRightOnSquareIcon, MapIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

interface CountryCostProps {
  country: string;
}

interface TravelCost {
  currency_icon: string;
  average_spend: string;
  avarage_cost_for_one_day_expenses: {
    price: string;
  }[];
  two_people_average_cost: string;
  global_cost_per_time_stay: {
    title: string;
    price_in_dollar: string;
    price_in_country_money: string;
  }[];
  average_one_week_cost: string;
  average_two_weeks: string;
  average_one_month: string;
  budget_travelers_cost_per_day: string;
  mid_range_travelers_per_day: string;
  luxury_travelers_cost_per_day: string;
  accomodation_on_budget_cost: string;
  accomodation_mid_range_cost: string;
  transport_on_budget: string;
  transport_mid_range: string;
  food_on_budget: string;
  food_mid_range: string;
  entertainment_on_budget: string;
  entertainment_mid_range: string;
  alcohol_on_budget: string;
  alcohol_mid_range: string;
  package_tours_cost: string;
  average_daily_costs_text: string;
  average_daily_cost: {
    title: string;
    price: string;
    price_country: string;
  }[];
  average_hotel_price: {
    price_type: string;
  }[];
  cost_per_region: {
    name: string;
    about: string;
  }[];
  local_transport_cost: {
    transport_name: string;
    price_country: string;
  }[];
  meal_food_cost: {
    name_price: string;
  }[];
  food_and_cooking_class: {
    description: string;
    more_details_url: string;
  }[];
  food_variety_cost: {
    name: string;
    price_country: string;
  }[];
  local_tour_cost: {
    tour_name: string;
    mode_details_url: string;
  }[];
}

const formatPriceText = (text: string) => {
  return text.replace(
    /\$\d+(?:,\d+)*(?:\.\d+)?\s*(?:\(₡[\d,]+\))?/g,
    match => `<strong>${match}</strong>`
  );
};

export default async function CountryCost({ country }: CountryCostProps) {
  const countryData = await import(`@/data/${country.toLowerCase().replace(/-/g, "_")}_data.json`);
  const travelCost: TravelCost = countryData[country.toLowerCase().replace(/-/g, "_")].travel_cost;

  return (
    <>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Discover {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())} Travel Costs: Your Complete {new Date().getFullYear()} Budget Guide
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Daily Cost */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Average Daily Cost</h2>
            </div>
            <p className="text-2xl font-bold text-blue-600">{travelCost.average_spend}</p>

            {/* Daily Expenses Breakdown */}
            <div className="space-y-2">
              {travelCost.avarage_cost_for_one_day_expenses.map((expense, index) => (
                <div key={index} className="flex justify-between items-center text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span
                    className="text-gray-900 font-medium"
                    dangerouslySetInnerHTML={{
                      __html: formatPriceText(expense.price)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Extended Stay Cost Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="h-6 w-6 text-gray-900" />
              <h2 className="text-lg font-semibold text-gray-900">Extended Stay Cost Information</h2>
            </div>
            <div className="flex items-start gap-2">
              <p className="text-gray-900">
                Planning an extended stay? Here&apos;s what you can expect to spend:
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">One Week</span>
                <span className="font-bold text-gray-900">{travelCost.average_one_week_cost}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">Two Weeks</span>
                <span className="font-bold text-gray-900">{travelCost.average_two_weeks}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-medium text-gray-900">One Month</span>
                <span className="font-bold text-gray-900">{travelCost.average_one_month}</span>
              </div>
            </div>


          </div>
          {/* Two People Cost */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <UsersIcon className="h-6 w-6 text-gray-900" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Average Cost for Two People for Two Weeks
              </h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">{travelCost.two_people_average_cost}</p>
          </div>
          {/* Package Tours Cost */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-full">
                <UsersIcon className="h-6 w-6 text-gray-900" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Package Tours Cost per Person
              </h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-4">{travelCost.package_tours_cost}</p>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Global Cost per Time Stay */}
        <div className="mt-8  rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-gray-100 rounded-full">
              <CurrencyDollarIcon className="h-7 w-7 text-gray-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                Travel Costs For Different Trip Durations in {country} ?
              </h2>
              <p className="mt-2 leading-relaxed text-gray-700">
                Planning your trip budget? Here&apos;s a comprehensive breakdown of expected costs across different durations,
                whether you&apos;re traveling solo or as a couple. These estimates include daily essentials like accommodation,
                meals, local transport, and popular activities to help you plan more effectively.
              </p>
              <div className="mt-4">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="bg-gray-100 p-3 text-left font-semibold text-gray-900 rounded-tl-lg">Duration</th>
                      <th className="bg-gray-100 p-3 text-right font-semibold text-gray-900">USD</th>
                      <th className="bg-gray-100 p-3 text-right font-semibold text-gray-900 rounded-tr-lg">Local Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelCost.global_cost_per_time_stay.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100/50 transition-colors group"
                      >
                        <td className="p-4 font-medium text-gray-900 border-b border-gray-200 group-last:border-0">
                          {item.title}
                        </td>
                        <td className="p-4 text-right font-medium text-gray-900 border-b border-gray-200 group-last:border-0">
                          ${item.price_in_dollar}
                        </td>
                        <td className="p-4 text-right font-medium text-gray-700 border-b border-gray-200 group-last:border-0">
                          {travelCost.currency_icon}{item.price_in_country_money}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Detailed Cost Comparison Table */}
        <div className="">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-gray-100 rounded-full">
              <CurrencyDollarIcon className="h-7 w-7 text-gray-900" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                How Much Does It Cost to Travel to {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}? A Complete Cost Breakdown
              </h2>
              {/* Cost Comparison Table */}
              <p className="mt-2 mb-2 leading-relaxed text-gray-700">
                <span className="font-semibold">Daily Budget Overview:</span> Budget travelers can expect to spend {travelCost.budget_travelers_cost_per_day},
                mid-range travelers {travelCost.mid_range_travelers_per_day}, and luxury travelers {travelCost.luxury_travelers_cost_per_day}.
              </p>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="bg-gray-50 p-3 text-left font-semibold text-gray-900 rounded-tl-lg">Category</th>
                      <th className="bg-gray-50 p-3 text-left font-semibold text-gray-900">Budget</th>
                      <th className="bg-gray-50 p-3 text-left font-semibold text-gray-900 rounded-tr-lg">Mid-Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        category: 'Accommodation',
                        budget: travelCost.accomodation_on_budget_cost,
                        midRange: travelCost.accomodation_mid_range_cost
                      },
                      {
                        category: 'Transportation',
                        budget: travelCost.transport_on_budget,
                        midRange: travelCost.transport_mid_range
                      },
                      {
                        category: 'Food',
                        budget: travelCost.food_on_budget,
                        midRange: travelCost.food_mid_range
                      },
                      {
                        category: 'Entertainment',
                        budget: travelCost.entertainment_on_budget,
                        midRange: travelCost.entertainment_mid_range
                      },
                      {
                        category: 'Alcohol & Drinks',
                        budget: travelCost.alcohol_on_budget,
                        midRange: travelCost.alcohol_mid_range
                      }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4 font-medium text-gray-900 border-b border-gray-200 group-last:border-0">{item.category}</td>
                        <td className="p-4 font-medium text-gray-900 border-b border-gray-200 group-last:border-0">${item.budget}</td>
                        <td className="p-4 font-medium text-gray-900 border-b border-gray-200 group-last:border-0">${item.midRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cost Analysis & Tips */}
              <div className="space-y-6 mt-4">
                {/* Budget Calculator */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Cost Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Average Daily Savings (Budget vs Mid-Range):</span>
                      <span className="font-medium text-emerald-600">
                        ${Number(travelCost.mid_range_travelers_per_day.replace('$', '')) - Number(travelCost.budget_travelers_cost_per_day.replace('$', ''))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Potential Weekly Savings:</span>
                      <span className="font-medium text-emerald-600">
                        ${(Number(travelCost.mid_range_travelers_per_day.replace('$', '')) - Number(travelCost.budget_travelers_cost_per_day.replace('$', ''))) * 7}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Average Daily Costs Overview */}
        <div className="">
          <div className="flex items-start gap-3 mb-4">
            <ChartBarIcon className="h-6 w-6 text-gray-900 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Understanding Your Daily Travel Budget in {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}
              </h2>
              <p className="mt-1 text-gray-600">
                Essential cost breakdown and money-saving tips
              </p>
            </div>
          </div>

          <div className="prose max-w-none">
            <p
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatPriceText(travelCost.average_daily_costs_text)
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <InformationCircleIcon className="h-5 w-5 text-gray-900 flex-shrink-0" />
            <p className="text-gray-700">
              These estimates are based on real traveler experiences and current market rates.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Average Daily Accommodation Costs */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HomeIcon className="h-6 w-6 text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Average Daily Accommodation Costs</h2>
            </div>

            <div className="space-y-4">
              {travelCost.average_daily_cost.map((cost, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <HomeModernIcon className="h-5 w-5 text-gray-900" />
                    <span className="text-gray-700">{cost.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {`$ ${cost.price} ${travelCost.currency_icon}${cost.price_country}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-900 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  Prices are based on average rates for standard accommodations. Luxury and budget options may vary significantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Average Hotel Price Ranges */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BuildingOffice2Icon className="h-6 w-6 text-gray-900" />
              <h2 className="text-2xl font-semibold text-gray-900">Hotel Price Ranges</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {travelCost.average_hotel_price.map((price, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {index === 0 && <ChartBarIcon className="h-5 w-5 text-gray-900" />}
                    {index === 1 && <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />}
                    {index === 2 && <BuildingOfficeIcon className="h-5 w-5 text-amber-600" />}
                    {index === 3 && <SparklesIcon className="h-5 w-5 text-purple-600" />}
                    <span
                      className="text-gray-700 font-medium"
                      dangerouslySetInnerHTML={{
                        __html: formatPriceText(price.price_type)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-900 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  Prices may vary based on location, season, and availability. Book in advance for best rates.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Regional Cost Breakdown */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPinIcon className="h-6 w-6 text-gray-900" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cost by Region</h2>
                <p className="text-sm text-gray-600 mt-1">Detailed pricing across different locations</p>
              </div>
            </div>

            <div className="space-y-6">
              {travelCost.cost_per_region.map((region, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-900" />
                    <h4 className="text-lg font-medium text-gray-900">{region.name}</h4>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatPriceText(region.about)
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-gray-900 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700">
                  Each region offers unique experiences and accommodations at different price points.
                  Consider your travel style and priorities when choosing where to stay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Local Transportation Costs */}
        <div className="">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TruckIcon className="h-7 w-7 text-gray-900" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Local Transportation Costs</h2>
                <p className="text-gray-600 mt-1">Common transportation options and their prices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {travelCost.local_transport_cost.map((transport, index) => (
                <div
                  key={index}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <TruckIcon
                      className={`h-5 w-5 ${transport.transport_name.toLowerCase().includes('bus')
                        ? 'text-gray-900'
                        : transport.transport_name.toLowerCase().includes('taxi')
                          ? 'text-gray-900'
                          : 'text-gray-900'
                        }`}
                    />
                    <span className="font-semibold text-gray-900">{transport.transport_name}</span>
                  </div>
                  <div className="text-gray-900 text-lg font-bold">
                    ₡{transport.price_country}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-gray-900 rounded-lg">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="h-5 w-5 text-white flex-shrink-0 mt-1" />
                <p className="text-white text-sm leading-relaxed">
                  Prices are approximate and may vary based on distance, time of day, and location.
                  Consider purchasing multi-trip passes for better value on public transportation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Meal & Food Costs */}
        <div className="mt-8 bg-gray-900 rounded-lg border border-gray-700 shadow-xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Square3Stack3DIcon className="h-7 w-7 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Meal & Food Costs</h2>
                <p className="text-gray-400 mt-1">Average prices for different meals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {travelCost.meal_food_cost.map((meal, index) => (
                <div
                  key={index}
                  className="p-5 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    {meal.name_price.toLowerCase().includes('breakfast') && (
                      <SunIcon className="h-5 w-5 text-amber-400" />
                    )}
                    {meal.name_price.toLowerCase().includes('lunch') && (
                      <Square3Stack3DIcon className="h-5 w-5 text-orange-400" />
                    )}
                    {meal.name_price.toLowerCase().includes('dinner') && (
                      <MoonIcon className="h-5 w-5 text-blue-400" />
                    )}
                    {meal.name_price.toLowerCase().includes('coffee') && (
                      <BeakerIcon className="h-5 w-5 text-amber-600" />
                    )}
                    {meal.name_price.toLowerCase().includes('fast food') && (
                      <ShoppingBagIcon className="h-5 w-5 text-emerald-400" />
                    )}
                    <span
                      className="text-white font-medium"
                      dangerouslySetInnerHTML={{
                        __html: formatPriceText(meal.name_price)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Prices may vary based on restaurant type, location, and season.
                  Local restaurants and street food typically offer better value than tourist-oriented establishments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Food & Cooking Classes */}
        <div className="">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <TagIcon className="h-7 w-7 text-gray-800" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Food & Cooking Classes
                </h2>
                <p className="text-gray-600 mt-1">Discover authentic local culinary experiences</p>
              </div>
            </div>

            <div className="space-y-4">
              {travelCost.food_and_cooking_class.map((item, index) => (
                <div
                  key={index}
                  className="p-5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <p
                      className="text-gray-800 font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatPriceText(item.description)
                      }}
                    />
                  </div>
                  <a
                    href={item.more_details_url}
                    className="ml-6 px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-medium">View Details</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Food Variety Costs */}
        <div className="">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Square3Stack3DIcon className="h-7 w-7 text-gray-900" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Local Food Prices
                </h2>
                <p className="text-gray-600 mt-1">Common food items and their costs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {travelCost.food_variety_cost.map((food, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {food.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-gray-900 font-medium">
                        ₡{food.price_country}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-4">
                <InformationCircleIcon className="h-6 w-6 text-gray-900" />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed text-gray-700">
                    Prices are indicative and may vary by location and season.
                    Local markets often offer better prices than tourist areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">
        {/* Local Tours */}
        <div className="">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-100 rounded-full">
                <MapIcon className="h-7 w-7 text-gray-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Tours & Activities Costs
                </h2>
                <p className="text-gray-600 mt-1">Discover unforgettable experiences</p>
              </div>
            </div>

            <div className="grid gap-4">
              {travelCost.local_tour_cost.map((tour, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg border border-gray-800 flex items-center justify-between"
                >
                  <div className="flex-1 pr-4">
                    <p
                      className="text-gray-900 font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatPriceText(tour.tour_name)
                      }}
                    />
                  </div>
                  <a
                    href={tour.mode_details_url}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-medium">View Details</span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-gray-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <InformationCircleIcon className="h-5 w-5 text-gray-900" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900 font-medium mb-1">Pro Travel Tip</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Tour prices include professional guides, quality equipment, and convenient transportation.
                    For the best rates and availability, we recommend booking your tours in advance, especially during peak season.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-white rounded-lg border border-gray-800 p-8">        
        {/* Travel Cost FAQ */}
        <div className="a">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions About Travel Costs</h2>
                <p className="text-sm text-gray-500 mt-1">Everything you need to know about budgeting your trip</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Total Cost */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">What is the total cost of visiting {country.replace(/-/g, ' ').replace(/(^\w|\s\w)/g, l => l.toUpperCase())}?</h4>
                <p className="text-gray-700">
                  For a comfortable trip, budget around {travelCost.average_spend} per day. A two-week stay costs approximately {travelCost.average_two_weeks}, while a month-long visit averages {travelCost.average_one_month}. For two people traveling together, expect to spend around {travelCost.two_people_average_cost} for two weeks.
                </p>
              </div>

              {/* Daily Budget */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">How much should I budget for daily expenses?</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">Daily budgets vary by travel style:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Budget travelers: {travelCost.budget_travelers_cost_per_day}</li>
                    <li>Mid-range travelers: {travelCost.mid_range_travelers_per_day}</li>
                    <li>Luxury travelers: {travelCost.luxury_travelers_cost_per_day}</li>
                  </ul>
                </div>
              </div>

              {/* Accommodation */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">What are the accommodation options and prices?</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">Accommodation costs vary by type:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Budget accommodations: {travelCost.accomodation_on_budget_cost} per night</li>
                    <li>Mid-range hotels: {travelCost.accomodation_mid_range_cost} per night</li>
                  </ul>
                </div>
              </div>

              {/* Transportation */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">What are the local transportation costs?</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">Transportation options range from:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Budget transport: {travelCost.transport_on_budget} per day</li>
                    <li>Mid-range transport: {travelCost.transport_mid_range} per day</li>
                  </ul>
                  <p className="text-gray-700 mt-3">Public transportation options include:</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {travelCost.local_transport_cost.map((transport, index) => (
                      <div key={index} className="text-gray-700">
                        {transport.transport_name}: ₡{transport.price_country}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Costs */}
              <div className="border-b border-gray-100 pb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">What is the average cost of food and dining?</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">Food expenses range from:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Budget dining: {travelCost.food_on_budget} per day</li>
                    <li>Mid-range dining: {travelCost.food_mid_range} per day</li>
                  </ul>
                  <p className="text-gray-700 mt-3">Sample food prices:</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {travelCost.food_variety_cost.slice(0, 4).map((food, index) => (
                      <div key={index} className="text-gray-700">
                        {food.name}: ₡{food.price_country}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Money-Saving Tips */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">How can I save money on my trip?</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Book accommodations in advance and look for weekly/monthly discounts</li>
                  <li>Use public transportation instead of taxis when possible</li>
                  <li>Eat at local restaurants and markets rather than tourist spots</li>
                  <li>Take advantage of free activities and walking tours</li>
                  <li>Travel during shoulder season for better rates</li>
                  <li>Consider cooking some meals if you have kitchen access</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-blue-700">
                  These estimates are based on current market rates and traveler experiences.
                  Actual costs may vary based on season, location, and personal preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 