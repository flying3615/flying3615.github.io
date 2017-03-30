---
layout: post
title: "Scala pattern matching and extractor"
date: 2017-03-30
---

# Pattern Matching: 
one of the very useful features of this powerful language.
It can be understood as unbinding a given data structure. However, this feature is not only unique for Scala, but also
exists in other outstanding languages like Haskell or Erlang.

Pattern-Matching can de-construct various data structure, like list, stream or case class.
But is it possible to expand this feature beyond above data structure? How does it work? or is there any magic
in it?

<pre class="prettyprint lang-scala">
case class User(firstName: String, lastName: String, score: Int)

def advance(xs: List[User]) = xs match {

  case User(_, _, score1) :: User(_, _, score2) :: _ => score1 - score2

  case _ => 0

}
</pre>

In reality, it's not magic but thanks to extractor.
Extractor works as the opposite of constructor:
While constructor build an object from given parameter list, extractor extracts parameter list from given object.

Case class is very special, Scala will create a companion object automatically, which is single object that includes *apply* and *unapply*
method.
*apply* is used to create instance, while *unapply* should be implemented by the companion object, and works as a 
extractor.

## The First Extractor

*unapply* method signature could be various, but we will start from the easiest one, after all the most widely used is one simple form of *unapply*.
Suppose we have a user *trait* having one field and two classes implement it

<pre class="prettyprint lang-scala">
trait User {
  def name: String
}

class FreeUser(val name: String) extends User

class PremiumUser(val name: String) extends User
</pre>

Now, we would like implement extractors for *FreeUser* and *PremiumUser* respectively, just like Scala does toward case class.
If you want the extractor just works as case class, only extract sinlge parameter from a given object, the *unapply* may look like this

<pre class="prettyprint lang-scala">
def unapply(object: S): Option[T]
</pre>

This *unapply* receives an object whose type is S, and return Option of T, which is the type you'd like to extract.
Below is our customised extractors

<pre class="prettyprint lang-scala">
trait User {
  def name: String
}

class FreeUser(val name: String) extends User

class PremiumUser(val name: String) extends User

object FreeUser {

  def unapply(user: FreeUser): Option[String] = Some(user.name)

}

object PremiumUser {

  def unapply(user: PremiumUser): Option[String] = Some(user.nam

e)

}
</pre>


Now, you can use it in REPL

<pre class="prettyprint lang-scala">
scala> FreeUser.unapply(new FreeUser("Daniel"))

res0: Option[String] = Some(Daniel)
</pre>

Actually, we don't invoke *unapply* directly rather than work with Pattern Matching like this:

<pre class="prettyprint lang-scala">
val user: User = new PremiumUser("Daniel")

user match {

  case FreeUser(name) => "Hello" + name

  case PremiumUser(name) => "Welcome back, dear" + name

}
</pre>

In this example, *FreeUser* won't be matched as it receives different type from input we passed in.
So that the object will be applied to the next one and it will be matched successfully with binding name with "Daniel"

Next, we will see an example which doesn't always return *Some[T]*

## Extract MultiValues

Now, suppose there is a class with multi-fields.
<pre class="prettyprint lang-scala">
trait User {

  def name: String

  def score: Int

}

class FreeUser(

  val name: String,

  val score: Int,

  val upgradeProbability: Double

) extends User

class PremiumUser(

  val name: String,

  val score: Int

) extends User
</pre>

*unapply* signature should be like this, which can extract multi-value
<pre class="prettyprint lang-scala">
def unapply(object: S): Option[(T1, ..., T2)]
</pre>

This method takes object of type S and return Option object with **TupleN** type.
N is the number of expected extract files.

<pre class="prettyprint lang-scala">

trait User {

  def name: String

  def score: Int

}

class FreeUser(

  val name: String,

  val score: Int,

  val upgradeProbability: Double

) extends User

class PremiumUser(

  val name: String,

  val score: Int

) extends User

object FreeUser {

  def unapply(user: FreeUser): Option[(String, Int, Double)] =

  Some((user.name, user.score, user.upgradeProbability))

}

object PremiumUser {

  def unapply(user: PremiumUser): Option[(String, Int)] =

  Some((user.name, user.score))

}
</pre>

Now you can use it working as Pattern Matching

<pre class="prettyprint lang-scala">
val user: User = new FreeUser("Daniel", 3000, 0.7d)

user match {

  case FreeUser(name, _, p) =>

    if (p > 0.75) "$name, what can we do for you today?"

    else "Hello $name"

  case PremiumUser(name, _) => "Welcome back, dear $name"

}
</pre>