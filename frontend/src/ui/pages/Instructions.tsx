import { Card, CardContent, CardHeader, CardTitle } from '@/ui/base/card'
import { ArrowRight } from 'lucide-react'

import Step1 from '@/assets/home/images/instructions/step-1.jpg'
import Step2 from '@/assets/home/images/instructions/step-2.jpg'
import Step3 from '@/assets/home/images/instructions/step-3.jpg'
import Step4 from '@/assets/home/images/instructions/step-4.jpg'
import Step5 from '@/assets/home/images/instructions/step-5.jpg'
import Step7 from '@/assets/home/images/instructions/step-7.jpg'
import Step8 from '@/assets/home/images/instructions/step-8.jpg'
import Step9 from '@/assets/home/images/instructions/step-9.jpg'
import Step10 from '@/assets/home/images/instructions/step-10.jpg'
import Step11 from '@/assets/home/images/instructions/step-11.jpg'

const Instructions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 scroll-smooth">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How to use
          </CardTitle>
        </CardHeader>

        {/* Table of Contents */}
        <CardContent className="pt-6 pb-0">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Table of Contents</h3>
            <nav>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#filling-uma-line"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Filling the uma line
                  </a>
                </li>
                <li>
                  <a
                    href="#edit-sparks-inheritances"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Edit Uma's sparks & inheritances
                  </a>
                </li>

                <li>
                  <a
                    href="#check-spark-chance-affinity"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    Check your spark chance & affinity
                  </a>
                </li>
                <li>
                  <a
                    href="#save-parent-uma"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    (Optional) Save parent uma for future re-use
                  </a>
                </li>
                <li>
                  <a
                    href="#save-entire-tree"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    (Optional) Save entire tree for different purposes
                  </a>
                </li>
                <li>
                  <a
                    href="#share-tree"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <ArrowRight className="w-3 h-3" />
                    (Optional) Share to yourself or other people
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </CardContent>

        <CardContent className="space-y-8 pt-0">
          <section className="my-8">
            <h2
              id="filling-uma-line"
              className="text-2xl font-semibold my-4 flex items-center gap-2"
            >
              Filling the uma line
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step1} className="block my-4" />
              <pre>
                1+2. Select the parent umas (also repeat for lower levels)
              </pre>
              <pre>3. Select the child uma</pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step2} className="block my-4" />
              <pre>1. Filter by name or pick from list</pre>
              <pre>2. Select the uma</pre>
            </div>
          </section>

          <section className="my-8">
            <h2
              id="edit-sparks-inheritances"
              className="text-2xl font-semibold my-4 flex items-center gap-2"
            >
              Edit Uma's sparks & inheritances
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
              <img src={Step3} className="block my-4" />
              <pre>1. Select stats/aptitude/unique skill and levels</pre>
              <pre>2. Fill white sparks</pre>
              <pre>
                3. Fill G1 races won (Currently G2/G3 counts too later won't)
              </pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step4} className="block my-4" />
              <pre>1. Filter by name or pick from list</pre>
              <pre>2. Select spark level</pre>
              <pre>
                3. Click Add (only white spark selector has this, other selector
                adds automatically)
              </pre>
              <pre>
                4. Delete single spark (or "Clear All" at top right if needed)
              </pre>
            </div>
          </section>

          <section className="my-8">
            <h2
              id="check-spark-chance-affinity"
              className="text-2xl font-semibold my-4 flex items-center gap-2"
            >
              Check your spark chance & affinity
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step8} className="block my-4" />
              <pre>
                1. Click this to show chance to inherit spark per career (2
                inspirations). Also this shows Affinity (this part needs more
                work, generally you should get the correct
                triangle/circle/double circle correctly but the value is a bit
                off)
              </pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h2
                id="save-entire-tree"
                className="text-2xl font-semibold my-4 flex items-center gap-2"
              >
                (Optional) Save entire tree for different purposes
              </h2>
              <img src={Step9} className="block my-4" />
              <pre>
                1. Click this, type in some name e.g. Virgo - Ace 1 2. Click
                this to get the saved trees
              </pre>
              <img src={Step10} className="block my-4" />
              <pre>1. Click this to load entire tree</pre>
              <pre>2. Click this to delete tree</pre>
            </div>
          </section>

          <section className="my-8">
            <h2
              id="save-parent-uma"
              className="text-2xl font-semibold my-4 flex items-center gap-2"
            >
              (Optional) Save parent uma for future re-use
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
              <img src={Step5} className="block my-4" />
              <pre>
                1. Save and put in some name e.g. "Spe - Med 3* - Groundwork 3*"
                etc. NOTES: Pick some unique name
              </pre>
              <pre>2. Clear this uma</pre>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step7} className="block my-4" />
              <pre>1. Saved Uma will be here in the Uma selector</pre>
              <pre>
                2. Click this to load uma with saved stats/aptitudes/sparks
              </pre>
            </div>
          </section>

          <section className="my-8">
            <h2
              id="share-tree"
              className="text-2xl font-semibold my-4 flex items-center gap-2"
            >
              (Optional) Share to yourself or other people
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <img src={Step11} className="block my-4" />
              <pre>1. Click this to get link</pre>
              <pre>2. Click this to copy URL and paste somewhere else</pre>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

export default Instructions
